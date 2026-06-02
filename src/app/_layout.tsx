import { OfflineBanner } from "@/components";
import { AuthProvider } from "@/context/AuthContext";
import { LMSProvider } from "@/context/LMSContext";
import { useAuth } from "@/hooks";
import { notificationService } from "@/services/notificationService";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  View,
} from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Request notification permissions and set initial 24h idle alert
    const setupNotifications = async () => {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        await notificationService.resetIdleReminder();
      }
    };

    setupNotifications();

    // Listen to notification responses (clicks) to trigger deep navigation
    const unsubscribeNotifications =
      notificationService.addNotificationResponseListener((screen) => {
        try {
          if (screen === "Bookmarks") {
            router.navigate("/(tabs)/bookmarks");
          } else if (screen === "Catalog") {
            router.navigate("/(tabs)");
          }
        } catch (error) {
          console.warn("Failed to navigate from notification click:", error);
        }
      });

    // Postpone reminder to future 24h whenever user shifts app back to foreground
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        await notificationService.resetIdleReminder();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, []);

  // Only show spinner on initial session restore, not during login/logout requests
  if (isLoading && !isAuthenticated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="course/[id]"
          options={{
            headerShown: true,
            title: "Course Details",
            headerTitleStyle: {
              fontFamily: "System",
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="webview"
          options={{
            headerShown: true,
            presentation: "modal",
            title: "Course Content",
          }}
        />
      </Stack>
      <OfflineBanner />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LMSProvider>
        <RootLayoutNav />
      </LMSProvider>
    </AuthProvider>
  );
}

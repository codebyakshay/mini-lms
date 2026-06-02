import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks";
import { ActivityIndicator, View } from "react-native";

function RootLayoutNav() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
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
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

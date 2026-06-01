import { Stack } from "expo-router";
import "../styles/global.css";

export default function RootLayout() {
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

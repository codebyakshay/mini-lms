import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.default,
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.neutral[200],
          height: Platform.OS === "ios" ? 88 : 60,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          backgroundColor: colors.light.card,
        },
        headerShown: true,
        headerTitleStyle: {
          fontFamily: "System",
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Courses",
          headerTitle: "Course Catalog",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          headerTitle: "My Bookmarks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

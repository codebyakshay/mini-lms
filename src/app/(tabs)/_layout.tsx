import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Dynamically calculate padding and height to prevent overlapping with native gesture bars / home indicators
  const tabBottomPadding = insets.bottom > 0 ? insets.bottom : 10;
  const tabBarHeight = 50 + tabBottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.default,
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.neutral[200],
          height: tabBarHeight,
          paddingBottom: tabBottomPadding,
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

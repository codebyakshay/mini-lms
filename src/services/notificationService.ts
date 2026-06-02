import * as ConstantsModule from "expo-constants";
import { Alert, Platform } from "react-native";

// Safely resolve the default export of expo-constants to avoid namespace issues under Hermes/Metro bundler
const Constants = (ConstantsModule as any).default || ConstantsModule;

let Notifications: any = null;

// Expo Go on Android has removed push/notifications features since SDK 53,
// making any import/load attempt throw an immediate crash or warning log.
// We bypass loading completely on Expo Go Android.
const isExpoGoAndroid =
  Platform.OS === "android" &&
  typeof Constants !== "undefined" &&
  Constants &&
  Constants.appOwnership === "expo";

if (!isExpoGoAndroid) {
  try {
    Notifications = require("expo-notifications");

    if (Notifications && Notifications.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  } catch (e) {
    console.warn("expo-notifications load failed in this environment:", e);
  }
} else {
  console.log(
    "Running in Expo Go on Android: Local notifications mocked to prevent system warnings.",
  );
}

const IDLE_REMINDER_ID = "lms_idle_reminder";

export const notificationService = {
  /**
   * Requests notifications permission from the user.
   * Returns true if granted, false otherwise.
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "web" || !Notifications) return false;

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#6366F1",
        });
      }

      return finalStatus === "granted";
    } catch (error) {
      console.warn("Failed to request notification permissions:", error);
      return false;
    }
  },

  /**
   * Fires an immediate notification when a user bookmarks 5+ courses.
   */
  async showMilestoneNotification(): Promise<void> {
    const title = "📚 Learning Journey Milestone!";
    const message =
      "Your Knowledge Vault is growing! You have bookmarked 5+ courses. Keep up the amazing learning momentum!";

    if (Platform.OS === "web" || !Notifications) {
      console.log(`Milestone Notification (Mock): ${title} - ${message}`);
      Alert.alert(title, message, [{ text: "Awesome!" }]);
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { screen: "Bookmarks" },
        },
        trigger: null, // triggers immediately
      });
    } catch (error) {
      console.warn("Failed to show milestone notification:", error);
    }
  },

  /**
   * Registers a listener that triggers when a user clicks on a notification.
   * Returns an unsubscribe function, or null if notifications are not available.
   */
  addNotificationResponseListener(
    onNavigate: (screen: string) => void,
  ): (() => void) | null {
    if (Platform.OS === "web" || !Notifications) return null;

    try {
      const subscription =
        Notifications.addNotificationResponseReceivedListener(
          (response: any) => {
            const screen =
              response?.notification?.request?.content?.data?.screen;
            if (screen) {
              onNavigate(screen);
            }
          },
        );
      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.warn("Failed to register notification response listener:", error);
      return null;
    }
  },

  /**
   * Resets the 24-hour idle reminder notification.
   * Cancels the previous idle reminder and schedules a new one for 24 hours from now.
   */
  async resetIdleReminder(): Promise<void> {
    if (Platform.OS === "web" || !Notifications) return;

    try {
      // Cancel previous reminder to prevent duplicates
      await Notifications.cancelScheduledNotificationAsync(IDLE_REMINDER_ID);

      // Schedule new reminder for 24 hours (86400 seconds) in the future
      await Notifications.scheduleNotificationAsync({
        identifier: IDLE_REMINDER_ID,
        content: {
          title: "🚀 Ready to continue learning?",
          body: "Don't break your study streak! Jump back into your course and build new skills today.",
          data: { screen: "Catalog" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 24 * 60 * 60, // 24 hours
          repeats: false,
        },
      });

      console.log("Postponed 24-hour idle reminder successfully.");
    } catch (error) {
      console.warn("Failed to reset idle reminder notification:", error);
    }
  },
};

export default notificationService;

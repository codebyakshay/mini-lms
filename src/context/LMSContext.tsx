import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import { notificationService } from "@/services/notificationService";

interface LMSContextType {
  bookmarks: string[];
  enrollments: string[];
  progress: number; // overall learning progress percentage
  toggleBookmark: (courseId: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  clearLMSState: () => Promise<void>;
  isLoading: boolean;
}

const LMSContext = createContext<LMSContextType | null>(null);

const STORAGE_KEYS = {
  BOOKMARKS: "@lms_bookmarks",
  ENROLLMENTS: "@lms_enrollments",
};

export const LMSProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state on startup
  useEffect(() => {
    let isMounted = true;

    const loadPersistedData = async () => {
      try {
        const [storedBookmarks, storedEnrollments] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
          AsyncStorage.getItem(STORAGE_KEYS.ENROLLMENTS),
        ]);

        if (storedBookmarks && isMounted) {
          try {
            const parsed = JSON.parse(storedBookmarks);
            if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
              setBookmarks(parsed);
            } else {
              console.warn("Invalid bookmarks format, clearing");
              await AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
            }
          } catch (parseErr) {
            console.error("Corrupted bookmarks data, clearing", parseErr);
            await AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
          }
        }

        if (storedEnrollments && isMounted) {
          try {
            const parsed = JSON.parse(storedEnrollments);
            if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
              setEnrollments(parsed);
            } else {
              console.warn("Invalid enrollments format, clearing");
              await AsyncStorage.removeItem(STORAGE_KEYS.ENROLLMENTS);
            }
          } catch (parseErr) {
            console.error("Corrupted enrollments data, clearing", parseErr);
            await AsyncStorage.removeItem(STORAGE_KEYS.ENROLLMENTS);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load LMS data from AsyncStorage", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPersistedData();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleBookmark = async (courseId: string) => {
    let previousBookmarks: string[] = [];

    try {
      setBookmarks((currentBookmarks) => {
        previousBookmarks = currentBookmarks;
        const isBookmarking = !currentBookmarks.includes(courseId);
        const updatedBookmarks = isBookmarking
          ? [...currentBookmarks, courseId]
          : currentBookmarks.filter((id) => id !== courseId);

        // Persist to storage asynchronously with proper error handling
        (async () => {
          try {
            await AsyncStorage.setItem(
              STORAGE_KEYS.BOOKMARKS,
              JSON.stringify(updatedBookmarks)
            );

            if (isBookmarking && updatedBookmarks.length === 5) {
              await notificationService.showMilestoneNotification().catch((err) =>
                console.error("Failed to trigger milestone notification", err)
              );
            }
          } catch (err) {
            console.error("Failed to save bookmarks, rolling back", err);
            setBookmarks(previousBookmarks);
            Alert.alert("Error", "Failed to save bookmark. Your changes were not saved.");
          }
        })();

        return updatedBookmarks;
      });
    } catch (error) {
      console.error("Unexpected error in toggleBookmark", error);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    let previousEnrollments: string[] = [];

    try {
      setEnrollments((currentEnrollments) => {
        previousEnrollments = currentEnrollments;

        if (currentEnrollments.includes(courseId)) {
          return currentEnrollments;
        }

        const updatedEnrollments = [...currentEnrollments, courseId];

        // Persist to storage asynchronously with proper error handling
        (async () => {
          try {
            await AsyncStorage.setItem(
              STORAGE_KEYS.ENROLLMENTS,
              JSON.stringify(updatedEnrollments)
            );
          } catch (err) {
            console.error("Failed to save enrollments, rolling back", err);
            setEnrollments(previousEnrollments);
            Alert.alert("Error", "Failed to enroll in course. Your changes were not saved.");
          }
        })();

        return updatedEnrollments;
      });
    } catch (error) {
      console.error("Unexpected error in enrollInCourse", error);
    }
  };

  const clearLMSState = async () => {
    try {
      setBookmarks([]);
      setEnrollments([]);
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS),
        AsyncStorage.removeItem(STORAGE_KEYS.ENROLLMENTS),
      ]);
    } catch (error) {
      console.error("Failed to clear LMS local storage", error);
    }
  };

  // Mock progress calculation: 25% progress per enrolled course (capped at 100%)
  const progress = Math.min(new Set(enrollments).size * 25, 100);

  return (
    <LMSContext.Provider
      value={{
        bookmarks,
        enrollments,
        progress,
        toggleBookmark,
        enrollInCourse,
        clearLMSState,
        isLoading,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMSContext = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error("useLMSContext must be used within an LMSProvider");
  }
  return context;
};

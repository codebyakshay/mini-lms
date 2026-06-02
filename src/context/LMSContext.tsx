import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const loadPersistedData = async () => {
      try {
        const [storedBookmarks, storedEnrollments] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
          AsyncStorage.getItem(STORAGE_KEYS.ENROLLMENTS),
        ]);

        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
        if (storedEnrollments) {
          setEnrollments(JSON.parse(storedEnrollments));
        }
      } catch (error) {
        console.error("Failed to load LMS data from AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedData();
  }, []);

  const toggleBookmark = async (courseId: string) => {
    try {
      setBookmarks((currentBookmarks) => {
        const isBookmarking = !currentBookmarks.includes(courseId);
        const updatedBookmarks = isBookmarking
          ? [...currentBookmarks, courseId]
          : currentBookmarks.filter((id) => id !== courseId);

        // Async save to storage
        AsyncStorage.setItem(
          STORAGE_KEYS.BOOKMARKS,
          JSON.stringify(updatedBookmarks)
        ).catch((err) => console.error("Failed to save bookmarks to storage", err));

        // Trigger local milestone notification when bookmark count reaches exactly 5
        if (isBookmarking && updatedBookmarks.length === 5) {
          notificationService.showMilestoneNotification().catch((err) =>
            console.error("Failed to trigger milestone notification", err)
          );
        }

        return updatedBookmarks;
      });
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      setEnrollments((currentEnrollments) => {
        if (currentEnrollments.includes(courseId)) return currentEnrollments;
        const updatedEnrollments = [...currentEnrollments, courseId];

        // Async save to storage
        AsyncStorage.setItem(
          STORAGE_KEYS.ENROLLMENTS,
          JSON.stringify(updatedEnrollments)
        ).catch((err) => console.error("Failed to save enrollments to storage", err));

        return updatedEnrollments;
      });
    } catch (error) {
      console.error("Failed to enroll in course", error);
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
  const progress = Math.min(enrollments.length * 25, 100);

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

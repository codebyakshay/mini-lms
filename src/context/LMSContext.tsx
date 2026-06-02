import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const updatedBookmarks = bookmarks.includes(courseId)
        ? bookmarks.filter((id) => id !== courseId)
        : [...bookmarks, courseId];

      setBookmarks(updatedBookmarks);
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.error("Failed to save bookmarks to storage", error);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (enrollments.includes(courseId)) return;
    try {
      const updatedEnrollments = [...enrollments, courseId];
      setEnrollments(updatedEnrollments);
      await AsyncStorage.setItem(
        STORAGE_KEYS.ENROLLMENTS,
        JSON.stringify(updatedEnrollments)
      );
    } catch (error) {
      console.error("Failed to save enrollments to storage", error);
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

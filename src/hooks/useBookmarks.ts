import { Course } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useLMS } from "./useLMS";

export function useBookmarks() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { bookmarks, toggleBookmark } = useLMS();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const cached = await AsyncStorage.getItem("@lms_courses_cache");
        if (cached) {
          setCourses(JSON.parse(cached));
        }
      } catch (error) {
        console.error("Failed to load courses for bookmarks", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [bookmarks]); // Sync whenever bookmarks change

  const bookmarkedCourses = courses.filter((course) =>
    bookmarks.includes(course.id),
  );

  return {
    bookmarkedCourses,
    isLoading,
    toggleBookmark,
    bookmarks,
  };
}

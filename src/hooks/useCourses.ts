import { api } from "@/services/api";
import { Course, Instructor } from "@/types";
import { APIResponse, FreeAPIProduct, FreeAPIUser } from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";

const CACHE_KEY = "@lms_courses_cache";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoursesAndInstructors = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Fetch products (courses) and users (instructors) in parallel from FreeAPI
      const [productsRes, usersRes] = await Promise.all([
        api.get<APIResponse<FreeAPIProduct>>("/public/randomproducts?page=1&limit=20"),
        api.get<APIResponse<FreeAPIUser>>("/public/randomusers?page=1&limit=20"),
      ]);

      const productsData: FreeAPIProduct[] = productsRes.data?.data?.data || [];
      const usersData: FreeAPIUser[] = usersRes.data?.data?.data || [];

      // Validate both arrays have data
      if (productsData.length === 0) {
        setError("No courses available. Please try again later.");
        return;
      }
      if (usersData.length === 0) {
        setError("Unable to load instructor information. Please try again.");
        return;
      }

      // Pair by index modulo—ensures every product gets an instructor
      // If fewer instructors than products, they cycle (e.g., 5 instructors, 20 products → repeats)
      const combined: Course[] = productsData.map((product, index) => {
        const user = usersData[index % usersData.length];

        const instructor: Instructor = {
          id: user.id.toString(),
          name: {
            title: user.name.title || "",
            first: user.name.first || "Unknown",
            last: user.name.last || "Instructor",
          },
          email: user.email || "",
          picture: {
            large: user.picture.large || "",
            medium: user.picture.medium || "",
            thumbnail: user.picture.thumbnail || "",
          },
        };

        return {
          id: product.id.toString(),
          title: product.title || "Untitled Course",
          description: product.description || "No description provided.",
          thumbnail: product.thumbnail || "",
          price: product.price || 0,
          category: product.category || "General",
          instructor,
        };
      });

      setCourses(combined);
      // Cache results for offline support
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(combined));
    } catch (err: any) {
      console.error("Failed to fetch courses from FreeAPI", err);
      // Hydrate from local cache when offline
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setCourses(JSON.parse(cached));
      } else {
        setError(
          err.message ||
            "Failed to load courses. Please check your internet connection.",
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndInstructors();
  }, []);

  // Filter courses based on search query matching
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const query = searchQuery.toLowerCase();
    return courses.filter((course) => {
      const titleMatch = course.title?.toLowerCase().includes(query);
      const descMatch = course.description?.toLowerCase().includes(query);
      const firstName = course.instructor?.name?.first?.toLowerCase() || "";
      const lastName = course.instructor?.name?.last?.toLowerCase() || "";
      const instructorMatch =
        firstName.includes(query) || lastName.includes(query);

      return titleMatch || descMatch || instructorMatch;
    });
  }, [searchQuery, courses]);

  const handleRefresh = () => {
    fetchCoursesAndInstructors(true);
  };

  return {
    courses: filteredCourses,
    searchQuery,
    setSearchQuery,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
  };
}


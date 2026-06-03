import { courseService } from "@/services/courseService";
import { Course, Instructor } from "@/types";
import { FreeAPIProduct, FreeAPIProductSchema, FreeAPIUser, FreeAPIUserSchema } from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";

const CACHE_KEY = "@lms_courses_cache";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoursesAndInstructors = async (showRefreshIndicator = false) => {
    await Promise.resolve(); // Defer execution to make state updates asynchronous
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Fetch products (courses) and users (instructors) in parallel from FreeAPI
      const [productsRes, usersRes] = await Promise.all([
        courseService.fetchCourses(20),
        courseService.fetchInstructors(20),
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

      // Validate API response schemas at runtime
      const validatedProducts = productsData.map((product) => {
        try {
          return FreeAPIProductSchema.parse(product);
        } catch (err) {
          if (err instanceof ZodError) {
            throw new Error(`Invalid product format: ${err.issues[0]?.message}`);
          }
          throw err;
        }
      });

      const validatedUsers = usersData.map((user) => {
        try {
          return FreeAPIUserSchema.parse(user);
        } catch (err) {
          if (err instanceof ZodError) {
            throw new Error(`Invalid user format: ${err.issues[0]?.message}`);
          }
          throw err;
        }
      });

      // Pair by index modulo—ensures every product gets an instructor
      // If fewer instructors than products, they cycle (e.g., 5 instructors, 20 products → repeats)
      const combined: Course[] = validatedProducts.map((product, index) => {
        const user = validatedUsers[index % validatedUsers.length];

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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch courses from FreeAPI", message);
      // Hydrate from local cache when offline
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          setCourses(JSON.parse(cached));
        } catch (parseErr) {
          console.error("Failed to parse cached courses", parseErr);
          setError("Failed to load courses. Please check your internet connection.");
        }
      } else {
        setError(
          message ||
            "Failed to load courses. Please check your internet connection.",
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoursesAndInstructors();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Filter courses based on search query matching
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const query = searchQuery.toLowerCase();
    return courses.filter((course) => {
      const titleMatch = course.title?.toLowerCase().includes(query) ?? false;
      const descMatch = course.description?.toLowerCase().includes(query) ?? false;
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


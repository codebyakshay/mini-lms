import { Button } from "@/components";
import { colors } from "@/constants/colors";
import { useLMS } from "@/hooks";
import { Course } from "@/types";
import { getCourseThumbnail } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { styles } from "./CourseDetailsScreen.styles";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { bookmarks, enrollments, toggleBookmark, enrollInCourse } = useLMS();

  const isBookmarked = course ? bookmarks.includes(course.id) : false;
  const isEnrolled = course ? enrollments.includes(course.id) : false;

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const cached = await AsyncStorage.getItem("@lms_courses_cache");
        if (cached) {
          const coursesList: Course[] = JSON.parse(cached);
          const found = coursesList.find((c) => c.id === id);
          if (found) {
            setCourse(found);
          }
        }
      } catch (error) {
        console.error("Failed to load course details", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  // Dynamically attach the Bookmark icon inside the navigation bar header
  useEffect(() => {
    if (!course) return;

    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => toggleBookmark(course.id)}
          style={styles.bookmarkHeaderBtn}
          hitSlop={8}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isBookmarked ? colors.primary.default : colors.neutral[600]}
          />
        </Pressable>
      ),
    });
  }, [navigation, course, isBookmarked]);

  const handleEnroll = async () => {
    if (!course) return;
    try {
      await enrollInCourse(course.id);
      Alert.alert(
        "Successfully Enrolled!",
        "You can now access the course content and start learning.",
      );
    } catch (err: any) {
      Alert.alert("Enrollment Failed", err.message || "Failed to enroll.");
    }
  };

  const handleStartLearning = () => {
    if (!course) return;
    router.push({
      pathname: "/webview",
      params: { id: course.id },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Course not found</Text>
        <Button
          title="Back to Catalog"
          onPress={() => router.back()}
          style={{ width: 160 }}
          variant="secondary"
        />
      </View>
    );
  }

  const instructorName = `${course.instructor?.name.title || ""} ${
    course.instructor?.name.first || ""
  } ${course.instructor?.name.last || ""}`.trim();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: getCourseThumbnail(course) }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* Category */}
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{course.title}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.priceValue}>${course.price}</Text>
          </View>

          <View style={styles.sectionDivider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>Course Description</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.sectionDivider} />

          {/* Instructor profile */}
          <Text style={styles.sectionTitle}>Instructor</Text>
          <View style={styles.instructorCard}>
            {course.instructor?.picture.medium ? (
              <Image
                source={{ uri: course.instructor.picture.medium }}
                style={styles.instructorAvatar}
              />
            ) : (
              <View style={styles.instructorAvatar} />
            )}
            <View style={styles.instructorDetails}>
              <Text style={styles.instructorName}>
                {instructorName || "Instructor"}
              </Text>
              <Text style={styles.instructorEmail}>
                {course.instructor?.email || "No contact email"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action bottom panel */}
      <View style={styles.bottomPanel}>
        {isEnrolled ? (
          <Button
            title="Start Learning"
            onPress={handleStartLearning}
            style={styles.enrollButton}
            variant="secondary"
          />
        ) : (
          <Button
            title="Enroll in Course"
            onPress={handleEnroll}
            style={styles.enrollButton}
          />
        )}
      </View>
    </View>
  );
}

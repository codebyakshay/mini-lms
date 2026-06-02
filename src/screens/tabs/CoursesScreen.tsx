import { Button, CourseCard, EmptyState, LoadingView } from "@/components";
import { colors } from "@/constants/colors";
import { useCourses, useLMS } from "@/hooks";
import { Course } from "@/types";
import { Feather } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./CoursesScreen.styles";

export default function CoursesScreen() {
  const router = useRouter();
  const {
    courses,
    searchQuery,
    setSearchQuery,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
  } = useCourses();

  const { bookmarks, toggleBookmark } = useLMS();

  const handleCoursePress = useCallback(
    (id: string) => {
      router.push(`/course/${id}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard
        key={item.id}
        item={item}
        isBookmarked={bookmarks.includes(item.id)}
        onPress={handleCoursePress}
        onToggleBookmark={toggleBookmark}
      />
    ),
    [bookmarks, handleCoursePress, toggleBookmark]
  );

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.container}>
        {/* Search header remains visible during loading */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Feather
              name="search"
              size={18}
              color={colors.neutral[400]}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
        </View>
        <LoadingView />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather
            name="search"
            size={18}
            color={colors.neutral[400]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses or instructors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.neutral[400]}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
              hitSlop={8}
            >
              <Feather name="x" size={16} color={colors.neutral[500]} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Main List / Error State */}
      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={handleRefresh}
            style={styles.retryButton}
            variant="secondary"
          />
        </View>
      ) : (
        <LegendList
          data={courses}
          extraData={bookmarks}
          renderItem={renderItem}
          keyExtractor={(item: Course) => item.id}
          contentContainerStyle={styles.listContent}
          estimatedItemSize={296}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          recycleItems={true}
          ListEmptyComponent={
            <EmptyState
              icon="book-open"
              message="No courses found matching search"
            />
          }
        />
      )}
    </View>
  );
}

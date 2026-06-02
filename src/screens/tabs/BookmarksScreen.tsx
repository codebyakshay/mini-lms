import { CourseCard, EmptyState, LoadingView } from "@/components";
import { useBookmarks } from "@/hooks";
import { Course } from "@/types";
import { LegendList } from "@legendapp/list/react-native";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { styles } from "./CoursesScreen.styles";

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarkedCourses, isLoading, toggleBookmark, bookmarks } =
    useBookmarks();

  const handleCoursePress = (id: string) => {
    router.push(`/course/${id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingView />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LegendList
        data={bookmarkedCourses}
        extraData={bookmarks}
        renderItem={({ item }) => (
          <CourseCard
            item={item}
            isBookmarked={true}
            onPress={handleCoursePress}
            onToggleBookmark={toggleBookmark}
          />
        )}
        keyExtractor={(item: Course) => item.id}
        contentContainerStyle={styles.listContent}
        estimatedItemSize={296}
        recycleItems={true}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark"
            message="You haven't bookmarked any courses yet"
          />
        }
      />
    </View>
  );
}

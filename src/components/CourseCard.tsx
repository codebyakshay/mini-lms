import { colors } from "@/constants/colors";
import { Course } from "@/types";
import { getCourseThumbnail } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useState } from "react";
import { Image, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";

const COURSE_CARD = {
  THUMBNAIL_HEIGHT: 160,
  CARD_PADDING: 16,
} as const;

interface CourseCardProps {
  item: Course;
  isBookmarked: boolean;
  onPress: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

function CourseCardComp({
  item,
  isBookmarked,
  onPress,
  onToggleBookmark,
}: CourseCardProps) {
  const [thumbnailHeight, setThumbnailHeight] = useState<number>(COURSE_CARD.THUMBNAIL_HEIGHT);

  const instructorName = `${item.instructor?.name.first || ""} ${
    item.instructor?.name.last || ""
  }`.trim();

  const formattedPrice = Number.isFinite(item.price) && item.price >= 0
    ? `$${item.price.toFixed(2)}`
    : "Price unavailable";

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const newHeight = e.nativeEvent.layout.height;
    setThumbnailHeight((prev) => {
      if (prev !== newHeight) {
        return newHeight;
      }
      return prev;
    });
  }, []);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onPress(item.id)}
        style={({ pressed }) => [
          styles.pressableContent,
          pressed && { opacity: 0.95 },
        ]}
      >
        <Image
          source={{ uri: getCourseThumbnail(item) }}
          style={[styles.thumbnail, { height: thumbnailHeight }]}
          onLayout={handleLayout}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          {/* Category Badge & Bookmark Space */}
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            {/* Reserve space for absolute bookmark button */}
            <View style={{ width: 32, height: 32 }} />
          </View>

          {/* Title & Description */}
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.instructorRow}>
              {item.instructor?.picture.thumbnail ? (
                <Image
                  source={{ uri: item.instructor.picture.thumbnail }}
                  style={styles.instructorAvatar}
                />
              ) : (
                <View style={[styles.instructorAvatar, styles.instructorAvatarPlaceholder]}>
                  <Text style={styles.instructorInitials}>
                    {item.instructor?.name.first?.[0]}{item.instructor?.name.last?.[0]}
                  </Text>
                </View>
              )}
              <Text style={styles.instructorName} numberOfLines={1}>
                {instructorName || "Instructor"}
              </Text>
            </View>
            <Text style={styles.price}>{formattedPrice}</Text>
          </View>
        </View>
      </Pressable>

      {/* Bookmark Button - Positioned dynamically based on thumbnail height */}
      <Pressable
        onPress={() => onToggleBookmark(item.id)}
        style={[
          styles.bookmarkButtonAbsolute,
          { top: thumbnailHeight + COURSE_CARD.CARD_PADDING },
        ]}
        hitSlop={12}
      >
        <Ionicons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          size={18}
          color={isBookmarked ? colors.primary.default : colors.neutral[500]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: colors.light.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: "hidden",
    marginBottom: 20,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Android shadow
    elevation: 2,
  },
  pressableContent: {
    width: "100%",
  },
  thumbnail: {
    width: "100%",
    height: COURSE_CARD.THUMBNAIL_HEIGHT,
    backgroundColor: colors.neutral[200],
  },
  cardContent: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primary.light,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary.default,
    textTransform: "uppercase",
  },
  bookmarkButtonAbsolute: {
    position: "absolute",
    right: COURSE_CARD.CARD_PADDING,
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    zIndex: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.neutral[900],
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.neutral[500],
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  instructorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[200],
    marginRight: 8,
  },
  instructorAvatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  instructorInitials: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.neutral[600],
  },
  instructorName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.neutral[700],
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.neutral[900],
  },
});

export default memo(CourseCardComp);

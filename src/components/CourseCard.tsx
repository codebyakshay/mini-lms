import { colors } from "@/constants/colors";
import { Course } from "@/types";
import { getCourseThumbnail } from "@/utils";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface CourseCardProps {
  item: Course;
  isBookmarked: boolean;
  onPress: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export default function CourseCard({
  item,
  isBookmarked,
  onPress,
  onToggleBookmark,
}: CourseCardProps) {
  const instructorName = `${item.instructor?.name.first || ""} ${
    item.instructor?.name.last || ""
  }`.trim();

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
          style={styles.thumbnail}
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
                <View style={styles.instructorAvatar} />
              )}
              <Text style={styles.instructorName} numberOfLines={1}>
                {instructorName || "Instructor"}
              </Text>
            </View>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
      </Pressable>

      {/* Bookmark Button - Positioned absolutely to prevent touch propagation issues */}
      <Pressable
        onPress={() => onToggleBookmark(item.id)}
        style={({ pressed }) => [
          styles.bookmarkButtonAbsolute,
          pressed && { opacity: 0.75 },
        ]}
        hitSlop={12}
      >
        <Feather
          name="bookmark"
          size={18}
          color={isBookmarked ? colors.primary.default : colors.neutral[400]}
          fill={isBookmarked ? colors.primary.default : "none"}
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
    height: 160,
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
    top: 176,
    right: 16,
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

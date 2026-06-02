import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: colors.neutral[900],
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
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
  bookmarkButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: colors.neutral[50],
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  retryButton: {
    width: 120,
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: "center",
    marginTop: 16,
  },
});

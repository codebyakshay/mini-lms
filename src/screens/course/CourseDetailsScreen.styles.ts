import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContainer: {
    paddingBottom: 100, // extra padding for fixed bottom panel
  },
  thumbnail: {
    width: "100%",
    height: 220,
    backgroundColor: colors.neutral[200],
  },
  content: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: colors.primary.light,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary.default,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.neutral[900],
    marginBottom: 8,
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.neutral[500],
    marginRight: 8,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.neutral[900],
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.neutral[900],
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.neutral[600],
    lineHeight: 22,
  },
  instructorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: 16,
    marginTop: 8,
  },
  instructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[200],
    marginRight: 12,
  },
  instructorDetails: {
    flex: 1,
  },
  instructorName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: 2,
  },
  instructorEmail: {
    fontSize: 13,
    color: colors.neutral[500],
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.light.card,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    // Android shadow
    elevation: 10,
  },
  enrollButton: {
    flex: 1,
  },
  enrolledButton: {
    backgroundColor: colors.success,
  },
  enrolledButtonText: {
    color: "#ffffff",
  },
  bookmarkHeaderBtn: {
    padding: 8,
    marginRight: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
});

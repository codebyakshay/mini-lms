import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    paddingHorizontal: 24,
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 16,
    padding: 32,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    // Android shadow
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.neutral[900],
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: "center",
    marginBottom: 28,
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  errorBannerText: {
    fontSize: 13,
    color: colors.error,
    textAlign: "center",
    fontWeight: "500",
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.neutral[600],
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.neutral[900],
    backgroundColor: colors.neutral[50],
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: "500",
  },
  passwordRow: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 10,
    backgroundColor: colors.neutral[50],
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 14,
    color: colors.neutral[900],
  },
  eyeButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  submitButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.neutral[500],
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neutral[900],
  },
});

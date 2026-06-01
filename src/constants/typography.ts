import { Platform } from "react-native";

export const typography = {
  fonts: {
    regular: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "sans-serif",
    }),
    medium: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
      default: "sans-serif",
    }),
    bold: Platform.select({
      ios: "System",
      android: "sans-serif-bold",
      default: "sans-serif",
    }),
    mono: Platform.select({
      ios: "Courier New",
      android: "monospace",
      default: "monospace",
    }),
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  weights: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  } as const,
} as const;

export type Typography = typeof typography;
export type TypographySizes = keyof typeof typography.sizes;

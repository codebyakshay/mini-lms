export const colors = {
  primary: {
    default: "#6366f1",
    dark: "#4f46e5",
    light: "#e0e7ff",
  },
  secondary: {
    default: "#0ea5e9",
    dark: "#0284c7",
  },
  accent: "#f59e0b",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  light: {
    background: "#f8fafc",
    text: "#0f172a",
    card: "#ffffff",
    border: "#e2e8f0",
  },
  dark: {
    background: "#0f172a",
    text: "#f8fafc",
    card: "#1e293b",
    border: "#334155",
  },
} as const;

export type Colors = typeof colors;
export type ColorKeys = keyof typeof colors;

import { colors } from "@/constants/colors";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  title: string;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  isLoading = false,
  variant = "primary",
  disabled,
  style,
  textStyle,
  ...pressableProps
}: ButtonProps) {
  const getButtonStyles = (pressed: boolean): ViewStyle[] => {
    const baseStyle = styles.button;
    let variantStyle: ViewStyle = styles.primaryButton;
    let pressedStyle: ViewStyle = pressed ? styles.primaryButtonPressed : {};

    if (variant === "secondary") {
      variantStyle = styles.secondaryButton;
      pressedStyle = pressed ? styles.secondaryButtonPressed : {};
    } else if (variant === "outline") {
      variantStyle = styles.outlineButton;
      pressedStyle = pressed ? styles.outlineButtonPressed : {};
    }

    const disabledStyle = disabled || isLoading ? styles.disabledButton : {};

    return [baseStyle, variantStyle, pressedStyle, disabledStyle, style || {}];
  };

  const getTextColor = (): string => {
    if (disabled || isLoading) return colors.neutral[400];
    if (variant === "outline") return colors.neutral[900];
    return "#ffffff";
  };

  const getIndicatorColor = (): string => {
    if (variant === "outline") return colors.neutral[900];
    return "#ffffff";
  };

  return (
    <Pressable
      disabled={disabled || isLoading}
      style={({ pressed }) => getButtonStyles(pressed)}
      {...pressableProps}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.neutral[900],
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButton: {
    backgroundColor: colors.primary.default,
  },
  secondaryButtonPressed: {
    backgroundColor: colors.primary.dark,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  outlineButtonPressed: {
    backgroundColor: colors.neutral[100],
  },
  disabledButton: {
    backgroundColor: colors.neutral[200],
    borderColor: colors.neutral[200],
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});

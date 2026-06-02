import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function InputField({
  label,
  error,
  isPassword = false,
  secureTextEntry,
  style,
  ...textInputProps
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          isPassword && styles.passwordRow,
          error ? styles.inputError : {},
        ]}
      >
        <TextInput
          style={[styles.input, isPassword ? styles.passwordInput : {}, style]}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          {...textInputProps}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={8}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={18}
              color={colors.neutral[500]}
            />
          </Pressable>
        )}
      </View>

      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 18,
    width: "100%",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.neutral[600],
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputWrapper: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 10,
    backgroundColor: colors.neutral[50],
  },
  input: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.neutral[900],
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 8,
  },
  eyeButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
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
});

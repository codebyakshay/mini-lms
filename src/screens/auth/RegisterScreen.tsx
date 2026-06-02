import { Button, InputField } from "@/components";
import { useRegisterForm } from "@/hooks";
import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen() {
  const router = useRouter();
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    handleRegister,
    clearError,
  } = useRegisterForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            {/* Header */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Mini LMS to start learning</Text>

            {/* General Error */}
            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            )}

            {/* Username */}
            <InputField
              label="Username"
              value={username}
              onChangeText={(val) => {
                setUsername(val);
                clearError("username");
              }}
              placeholder="johndoe"
              autoCapitalize="none"
              error={errors.username}
            />

            {/* Email */}
            <InputField
              label="Email Address"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                clearError("email");
              }}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />

            {/* Password */}
            <InputField
              label="Password"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                clearError("password");
              }}
              placeholder="••••••••"
              isPassword
              error={errors.password}
            />

            {/* Submit */}
            <Button
              title="Sign Up"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.submitButton}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.footerLink}> Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, InputField } from "@/components";
import { useLoginForm } from "@/hooks";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const router = useRouter();
  const {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
    clearError,
  } = useLoginForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            {/* Header */}
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your Mini LMS account
            </Text>

            {/* General Error */}
            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            )}

            {/* Email / Username */}
            <InputField
              label="Email or Username"
              value={emailOrUsername}
              onChangeText={(val) => {
                setEmailOrUsername(val);
                clearError("email");
              }}
              placeholder="you@example.com or username"
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
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.submitButton}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.footerLink}> Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

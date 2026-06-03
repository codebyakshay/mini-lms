import { Button, InputField } from "@/components";
import { useLoginForm } from "@/hooks";
import { useRouter } from "expo-router";
import { Controller } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    generalError,
    isLoading,
    handleLogin,
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
            {generalError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            )}

            {/* Email / Username */}
            <Controller
              control={control}
              name="emailOrUsername"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Email or Username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="you@example.com or username"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.emailOrUsername?.message}
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  isPassword
                  error={errors.password?.message}
                />
              )}
            />

            {/* Submit */}
            <Button
              title="Sign In"
              onPress={handleSubmit(handleLogin)}
              isLoading={isLoading}
              style={styles.submitButton}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{"Don't have an account?"}</Text>
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

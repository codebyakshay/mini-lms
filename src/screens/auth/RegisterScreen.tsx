import { Button, InputField } from "@/components";
import { useRegisterForm } from "@/hooks";
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
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    generalError,
    clearGeneralError,
    isLoading,
    handleRegister,
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
            {generalError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            )}

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Username"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    clearGeneralError();
                  }}
                  onBlur={onBlur}
                  placeholder="johndoe"
                  autoCapitalize="none"
                  error={errors.username?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Email Address"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    clearGeneralError();
                  }}
                  onBlur={onBlur}
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.email?.message}
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
                  onChangeText={(text) => {
                    onChange(text);
                    clearGeneralError();
                  }}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  isPassword
                  error={errors.password?.message}
                />
              )}
            />

            {/* Submit */}
            <Button
              title="Sign Up"
              onPress={handleSubmit(handleRegister)}
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


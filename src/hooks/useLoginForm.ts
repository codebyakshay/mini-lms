import { useState } from "react";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!emailOrUsername.trim()) {
      newErrors.email = "Email or Username is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setErrors({});
    try {
      await login(emailOrUsername, password);
    } catch (err: any) {
      setErrors({
        general:
          err.message || "Failed to log in. Please check your credentials.",
      });
    }
  };

  const clearError = (field: "email" | "password" | "general") => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
    clearError,
  };
}

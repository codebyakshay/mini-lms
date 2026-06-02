import { useState } from "react";
import { useAuth } from "./useAuth";

export function useRegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { register, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setErrors({});
    try {
      await register(username, email, password);
    } catch (err: any) {
      setErrors({
        general: err.message || "Failed to create account. Please try again.",
      });
    }
  };

  const clearError = (field: "username" | "email" | "password" | "general") => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
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
  };
}

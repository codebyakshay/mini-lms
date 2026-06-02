import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFields } from "@/types";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFields) => {
    setGeneralError(null);
    try {
      await login(data.emailOrUsername, data.password);
    } catch (err: any) {
      setGeneralError(
        err.message || "Failed to log in. Please check your credentials."
      );
    }
  };

  const clearGeneralError = () => {
    if (generalError) {
      setGeneralError(null);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    generalError,
    clearGeneralError,
    isLoading,
    handleLogin,
  };
}


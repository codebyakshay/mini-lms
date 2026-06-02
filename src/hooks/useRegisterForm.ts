import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFields } from "@/types";
import { useAuth } from "./useAuth";

export function useRegisterForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (data: RegisterFields) => {
    setGeneralError(null);
    try {
      await register(data.username, data.email, data.password);
    } catch (err: any) {
      setGeneralError(
        err.message || "Failed to create account. Please try again."
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
    handleRegister,
  };
}


import { LoginFields, loginSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const { control, handleSubmit, formState, clearErrors } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFields) => {
    setGeneralError(null);
    clearErrors();
    setIsSubmitting(true);

    try {
      await login(data.emailOrUsername, data.password);
    } catch (err: any) {
      const errMsg =
        err?.message || "Failed to log in. Please check your credentials.";
      setGeneralError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    control,
    handleSubmit,
    formState,
    generalError,
    isLoading: isSubmitting,
    handleLogin,
  };
}

import { RegisterFields, registerSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "./useAuth";

export function useRegisterForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState,
    setError,
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
      const errMsg =
        err.message || "Failed to create account. Please try again.";
      if (errMsg.toLowerCase().includes("username")) {
        setError("username", {
          type: "manual",
          message: errMsg,
        });
      } else if (errMsg.toLowerCase().includes("email")) {
        setError("email", {
          type: "manual",
          message: errMsg,
        });
      } else {
        setGeneralError(errMsg);
      }
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
    formState,
    generalError,
    clearGeneralError,
    isLoading,
    handleRegister,
  };
}

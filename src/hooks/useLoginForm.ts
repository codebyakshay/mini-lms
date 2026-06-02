import { LoginFields, loginSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const [generalError, setGeneralErrorState] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const { control, handleSubmit, formState, clearErrors } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const setGeneralError = (error: string | null) => {
    console.log("setGeneralError called with:", error);
    setGeneralErrorState(error);
    console.log("setGeneralError state update queued");
  };

  const handleLogin = async (data: LoginFields) => {
    console.log("handleLogin called with:", data.emailOrUsername);
    setGeneralError(null);
    clearErrors();

    try {
      console.log("Attempting login with:", data.emailOrUsername);
      await login(data.emailOrUsername, data.password);
      console.log("Login succeeded!");
    } catch (err: any) {
      console.error("Login error caught in handleLogin:", err);
      const errMsg =
        err?.message || "Failed to log in. Please check your credentials.";

      console.log("About to set error message:", errMsg);
      setGeneralError(errMsg);
      console.log("Error message set, waiting for re-render");
    }
  };

  const clearGeneralError = () => {
    console.log("clearGeneralError called");
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
    handleLogin,
  };
}

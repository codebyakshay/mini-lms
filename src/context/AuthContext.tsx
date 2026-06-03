import { authService } from "@/services/authService";
import { AuthState } from "@/types";
import { storage } from "@/utils/storage";
import { useRouter } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType extends AuthState {
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (imageUri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  // Load stored session on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = await storage.getAccessToken();
        if (accessToken) {
          // Verify token and fetch current user profile
          const response = await authService.getCurrentUser();
          if (response.data && response.data.success) {
            setState({
              token: accessToken,
              user: response.data.data,
              isAuthenticated: true,
              isLoading: false,
            });
            // Redirect to tabs
            router.replace("/(tabs)");
            return;
          }
        }
      } catch (error) {
        // Token was invalid/expired and refresh failed
        await storage.clearAuthTokens();
      } finally {
        setState((s) => ({ ...s, isLoading: false }));
      }
    };

    restoreSession();
  }, [router]);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const payload = emailOrUsername.includes("@")
        ? { email: emailOrUsername }
        : { username: emailOrUsername };

      const response = await authService.login({
        ...payload,
        password,
      });

      if (response.data && response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        await storage.setAccessToken(accessToken);
        await storage.setRefreshToken(refreshToken);
        setState({
          token: accessToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        router.replace("/(tabs)");
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
    } catch (error: any) {
      let errorMessage = "Login failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message && !error.message.includes("Login failed")) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const response = await authService.register({
        username,
        email,
        password,
        role: "USER", // Default role required by FreeAPI
      });

      if (response.data && response.data.success) {
        // Auto log in after registration
        setState((s) => ({ ...s, isLoading: false }));
        await login(username, password);
      }
    } catch (error: any) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await authService.logout();
    } catch (error) {
      // Ignore API logout failures and clear locally
    } finally {
      await storage.clearAuthTokens();
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.replace("/(auth)/login");
    }
  };

  const updateAvatar = async (imageUri: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("avatar", {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      const response = await authService.updateAvatar(formData);

      if (response.data && response.data.success) {
        const updatedUser = response.data.data;
        setState((s) => ({
          ...s,
          user: updatedUser,
          isLoading: false,
        }));
      }
    } catch (error: any) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(
        error.response?.data?.message || "Failed to update avatar",
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

import { z } from "zod";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: {
    url: string;
    localPath?: string;
  } | null;
  role: string;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  instructor?: Instructor;
  isBookmarked?: boolean;
  isEnrolled?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LMSAppState {
  courses: Course[];
  bookmarks: string[]; // List of course IDs
  enrollments: string[]; // List of enrolled course IDs
  isLoading: boolean;
  error: string | null;
}

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFields = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscores only"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFields = z.infer<typeof registerSchema>;


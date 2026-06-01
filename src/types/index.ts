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

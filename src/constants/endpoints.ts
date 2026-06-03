export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    LOGOUT: "/users/logout",
    CURRENT_USER: "/users/current-user",
    REFRESH_TOKEN: "/users/refresh-token",
    AVATAR: "/users/avatar",
  },
  COURSES: {
    PRODUCTS: "/public/randomproducts",
    USERS: "/public/randomusers",
  },
} as const;

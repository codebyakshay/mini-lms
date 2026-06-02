import axios from "axios";
import { storage } from "@/utils/storage";

const API_BASE_URL = "https://api.freeapi.app/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the access token to the request headers
api.interceptors.request.use(
  async (config) => {
    const accessToken = await storage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle automatic token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token stored");
        }

        // Hit the refresh token endpoint
        // In apihub, the refresh token can be passed in the body or as a Bearer token
        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        if (response.data && response.data.success) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Store the new tokens
          await storage.setAccessToken(newAccessToken);
          await storage.setRefreshToken(newRefreshToken);

          // Update Authorization header and retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear all tokens and log out the user
        await storage.clearAuthTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

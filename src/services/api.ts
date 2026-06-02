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

// Response Interceptor: Handle automatic token refresh on 401 errors and request retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry Logic: Handle transient network dropouts, request timeouts, or 5xx server errors
    const isNetworkOrTimeout =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout");
    const is5xxError = error.response && error.response.status >= 500;
    const isTimeoutStatus = error.response && error.response.status === 408;

    if (
      (isNetworkOrTimeout || is5xxError || isTimeoutStatus) &&
      originalRequest &&
      (!originalRequest._retryCount || originalRequest._retryCount < 3)
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Exponential backoff: 1s, 2s, 4s delay
      const delayMs = Math.pow(2, originalRequest._retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      console.warn(
        `API request failed: ${error.message}. Retrying ${originalRequest.url} (Attempt ${originalRequest._retryCount}/3) in ${delayMs}ms...`
      );
      return api(originalRequest);
    }

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

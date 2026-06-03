import { ENDPOINTS } from "@/constants/endpoints";
import { isNetworkOrTimeoutError, isServerError, getRetryDelay } from "@/utils/apiHelpers";
import { storage } from "@/utils/storage";
import axios from "axios";

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
  },
);

// Response Interceptor: Handle automatic token refresh on 401 errors and request retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry Logic: Handle transient network dropouts, request timeouts, or 5xx server errors
    const shouldRetry = isNetworkOrTimeoutError(error) || isServerError(error);

    if (
      shouldRetry &&
      originalRequest &&
      (!originalRequest._retryCount || originalRequest._retryCount < 3)
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Exponential backoff
      const delayMs = getRetryDelay(originalRequest._retryCount);
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      console.warn(
        `API request failed: ${error.message}. Retrying ${originalRequest.url} (Attempt ${originalRequest._retryCount}/3) in ${delayMs}ms...`,
      );
      return api(originalRequest);
    }

    // Check if error is 401 Unauthorized and not already retried
    // Do NOT attempt token refresh on login or register requests
    const isAuthRequest =
      originalRequest?.url?.includes(ENDPOINTS.AUTH.LOGIN) ||
      originalRequest?.url?.includes(ENDPOINTS.AUTH.REGISTER);

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token stored");
        }

        // Hit the refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
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
  },
);

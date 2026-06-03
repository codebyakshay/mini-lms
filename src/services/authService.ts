import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

export const authService = {
  async getCurrentUser() {
    return api.get(ENDPOINTS.AUTH.CURRENT_USER);
  },

  async login(payload: { username?: string; email?: string; password?: string }) {
    return api.post(ENDPOINTS.AUTH.LOGIN, payload);
  },

  async register(payload: { username?: string; email?: string; password?: string; role?: string }) {
    return api.post(ENDPOINTS.AUTH.REGISTER, payload);
  },

  async logout() {
    return api.post(ENDPOINTS.AUTH.LOGOUT);
  },

  async updateAvatar(formData: FormData) {
    return api.patch(ENDPOINTS.AUTH.AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

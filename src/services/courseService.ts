import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/services/api";
import { APIResponse, FreeAPIProduct, FreeAPIUser } from "@/types/api";

export const courseService = {
  async fetchCourses(limit = 20) {
    return api.get<APIResponse<FreeAPIProduct>>(
      `${ENDPOINTS.COURSES.PRODUCTS}?page=1&limit=${limit}`,
    );
  },

  async fetchInstructors(limit = 20) {
    return api.get<APIResponse<FreeAPIUser>>(
      `${ENDPOINTS.COURSES.USERS}?page=1&limit=${limit}`,
    );
  },
};

import { ApiClient } from "@/services/ApiClient";
import { User } from "@/features/auth/stores/authStore";

export const userApi = {
  getUser: async (userId: string) => {
    const response = await ApiClient.get(`/user/profile/${userId}`);
    return response.data;
  },
  updateUser: async (userId: string, data: FormData) => {
    const response = await ApiClient.put<User>(`/user/update/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
};

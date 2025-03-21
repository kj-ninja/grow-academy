import { ApiClient } from "@/services/ApiClient";
import { User } from "@/features/auth/stores/authStore";

export const userApi = {
  getCurrentUser: async () => {
    const response = await ApiClient.get<User>("/user/me");
    return response.data;
  },
  getUser: async (username: string) => {
    const response = await ApiClient.get<User>(`/user/profile/${username}`);
    return response.data;
  },
  updateUser: async (data: FormData) => {
    const response = await ApiClient.patch<User>("/user/update", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
};

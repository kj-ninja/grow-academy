import { ApiClient } from "@/services/ApiClient";
import { type User } from "@/features/auth/stores/authStore";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  streamToken: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export const authApi = {
  register: async (credentials: AuthCredentials) => {
    const response = await ApiClient.post<AuthCredentials>(
      "/auth/register",
      credentials,
    );
    return response.data;
  },
  login: async (credentials: AuthCredentials) => {
    const response = await ApiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },
  validate: async (): Promise<User> => {
    const response = await ApiClient.get<User>("/auth/validate");
    return response.data;
  },
};

import { ApiClient } from "@/services/ApiClient";

type Role = "admin" | "user";

export interface User {
  id: number;
  username: string;
  role: Role;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export const authApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await ApiClient.get<User[]>("/users");
    return response.data;
  },
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

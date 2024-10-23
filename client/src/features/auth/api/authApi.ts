import { ApiClient } from "@/services/ApiClient";

// todo: how to keep types in sync with the backend? Especially requests and responses.
export interface User {
  id: number;
  username: string;
  // todo: add union type
  role: string;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
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
    const response = await ApiClient.post<AuthCredentials>("/auth/register", credentials);
    return response.data;
  },
  login: async (credentials: AuthCredentials) => {
    const response = await ApiClient.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },
};

import { ApiClient } from "@/services/ApiClient";

export interface User {
  id: number;
  name: string;
}

export const authApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await ApiClient.get<User[]>("/users");
    return response.data;
  },
};

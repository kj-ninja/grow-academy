import { ApiClient } from "@/services/ApiClient";

export interface User {
  id: number;
  name: string;
}

export const userApi = {
  getUsers: (): Promise<User[]> => ApiClient.get("/users"),
};

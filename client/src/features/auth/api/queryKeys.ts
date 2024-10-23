import { authApi } from "@/features/auth/api/authApi";
import { queryOptions } from "@tanstack/react-query";

export const AuthQueries = {
  getUsers: () =>
    queryOptions({
      queryKey: ["getUsers"],
      queryFn: () => authApi.getUsers(),
    }),
};

import { authApi } from "@/features/auth/api/authApi";
import { queryOptions } from "@tanstack/react-query";

export const AuthQueries = {
  validateToken: () =>
    queryOptions({
      queryKey: ["validateToken"],
      queryFn: () => authApi.validate(),
      retry: false,
    }),
};

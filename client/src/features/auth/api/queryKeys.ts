import { userApi } from "@/features/auth/api";
import { createQueryKeys } from "@/services/ReactQuery";

export const AuthQueries = createQueryKeys("auth", {
  getUsers: {
    queryKey: ["getUsers"],
    queryFn: () => userApi.getUsers(),
  },
});

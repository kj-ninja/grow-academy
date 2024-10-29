import { queryOptions } from "@tanstack/react-query";
import { userApi } from "@/features/user/api";

export const UserQueries = {
  getUser: (username: string) =>
    queryOptions({
      queryKey: ["getUser", username],
      queryFn: () => userApi.getUser(username),
    }),
};

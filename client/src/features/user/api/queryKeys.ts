import { queryOptions } from "@tanstack/react-query";
import { userApi } from "@/features/user/api";

export const UserQueries = {
  getUser: (id: string) =>
    queryOptions({
      queryKey: ["getUser", id],
      queryFn: () => userApi.getUser(id),
    }),
};

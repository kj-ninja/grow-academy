import { queryOptions } from "@tanstack/react-query";
import { userApi } from "@/features/user/api/userApi";

export const UserQueries = {
  getUser: (id: string) =>
    queryOptions({
      queryKey: ["getUser", id],
      queryFn: () => userApi.getUser(id),
    }),
};

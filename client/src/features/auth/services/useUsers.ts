import { useQuery } from "@tanstack/react-query";
import { AuthQueries } from "@/features/auth/api/queryKeys";

export const useUsers = () => {
  const userQuery = useQuery({
    ...AuthQueries.getUsers,
  });

  return {
    users: userQuery.data ?? [],
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
  };
};

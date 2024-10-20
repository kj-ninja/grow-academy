import { useQuery } from "@tanstack/react-query";
import { AuthQueries } from "@/features/auth/api/queryKeys";

export function useUsers() {
  return useQuery(AuthQueries.getUsers());
}

import { useAuthState } from "@/features/auth/stores/authStore";
import { UserQueries } from "@/features/user/api/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useCurrentUser() {
  const { status } = useAuthState();
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    ...UserQueries.getCurrentUser(),
    staleTime: 24 * 3600 * 1000,
    enabled: status === "authenticated",
  });

  const refetchUserProfile = async () => {
    const response = await currentUserQuery.refetch();
    if (response.data?.username) {
      queryClient.setQueryData(
        UserQueries.getUser(response.data.username).queryKey,
        response.data,
      );
    }
  };

  return {
    currentUser: currentUserQuery.data ?? null,
    isActive: Boolean(currentUserQuery.data && currentUserQuery.data.isActive),
    refetchUserProfile,
    isLoading: currentUserQuery.isLoading,
    isError: currentUserQuery.isError,
  };
}

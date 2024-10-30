import { useMutation } from "@tanstack/react-query";
import { userApi, UserQueries } from "@/features/user/api";
import { useAuthState, User } from "@/features/auth/stores/authStore";
import { queryClient } from "@/services/ReactQuery";

export const useUpdateUserMutation = () => {
  const { setUser } = useAuthState();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => {
      return userApi.updateUser(id, data);
    },
    onSuccess: async (data: User) => {
      // setUser(data);
      await queryClient.invalidateQueries(UserQueries.getUser(data.username));
    },
  });
};

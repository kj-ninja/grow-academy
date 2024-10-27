import { useMutation } from "@tanstack/react-query";
import { useAuthState, User } from "@/features/auth/stores/authStore";
import { userApi } from "@/features/user/api";

export const useUpdateUserMutation = () => {
  const { setUser } = useAuthState();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => {
      return userApi.updateUser(id, data);
    },
    onSuccess: (data: User) => {
      setUser(data);
    },
  });
};

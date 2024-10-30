import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/features/user/api";

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => {
      return userApi.updateUser(id, data);
    },
  });
};

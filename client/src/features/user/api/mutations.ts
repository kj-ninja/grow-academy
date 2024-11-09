import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/features/user/api";

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => {
      return userApi.updateUser(data);
    },
  });
};

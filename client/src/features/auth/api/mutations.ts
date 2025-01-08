import { useMutation } from "@tanstack/react-query";
import { authApi, AuthCredentials } from "@/features/auth/api";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api/queryKeys";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => {
      return authApi.register(credentials);
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => {
      return authApi.login(credentials);
    },
    onSuccess: (data) => {
      console.log("streamToken: ", data.streamToken);
      console.log("user: ", data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
};

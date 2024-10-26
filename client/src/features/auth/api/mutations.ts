import { useMutation } from "@tanstack/react-query";
import { authApi, AuthCredentials } from "@/features/auth/api";

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
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
};

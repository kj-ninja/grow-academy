import { useMutation } from "@tanstack/react-query";
import { authApi, AuthCredentials } from "@/features/auth/api";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      return await authApi.register(credentials);
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      return await authApi.login(credentials);
    },
    onSuccess: (data) => {
      console.log("success login:", data);
      localStorage.setItem("token", data.token);
    },
  });
};

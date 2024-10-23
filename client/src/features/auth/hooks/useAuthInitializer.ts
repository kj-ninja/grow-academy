import { useEffect } from "react";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/services/ApiClient";

export const useAuthInitializer = () => {
  const { setAuthState, logout } = useAuthState();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthState({ status: "unauthenticated", user: null });
      return;
    }

    const validateToken = async () => {
      try {
        const response = await ApiClient.get("/auth/validate");
        setAuthState({ status: "authenticated", user: response.data.user });
        // todo: set user data
        // queryClient.setQueryData("currentUser", response.data.user);
      } catch {
        logout();
      }
    };

    validateToken();
  }, [setAuthState, logout, queryClient]);
};

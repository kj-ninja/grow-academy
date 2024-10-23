import { useEffect } from "react";
import { useAuthState } from "@/features/auth/stores/authStore";
import { ApiClient } from "@/services/ApiClient";

export const useAuthInitializer = () => {
  const { setAuthState, logout } = useAuthState();

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
      } catch {
        logout();
      }
    };

    validateToken();
  }, [setAuthState, logout]);
};

import { useQuery } from "@tanstack/react-query";
import { AuthQueries } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useEffect } from "react";

export const useAuthInitializer = () => {
  const { setAuthState, logout } = useAuthState();
  const { data, isError } = useQuery(AuthQueries.validateToken());

  useEffect(() => {
    if (isError) {
      logout();
      return;
    }

    if (data) {
      setAuthState({ status: "authenticated", user: data });
    }
  }, [data, isError, setAuthState, logout]);
};

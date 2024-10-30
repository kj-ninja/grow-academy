import { useQuery } from "@tanstack/react-query";
import { AuthQueries } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useEffect } from "react";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api";

export const useAuthInitializer = () => {
  const { setAuthState, logout } = useAuthState();
  const { data, isError, isLoading } = useQuery(AuthQueries.validateToken());

  useEffect(() => {
    if (isLoading && !data) {
      setAuthState("initializing");
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (isError) {
      logout();
      return;
    }

    if (data) {
      queryClient
        .fetchQuery({
          ...UserQueries.getCurrentUser(),
        })
        .then(() => {
          setAuthState("authenticated");
        })
        .catch(() => {
          logout();
        });
    }
  }, [data, isError, setAuthState, logout]);
};

import { useQuery } from "@tanstack/react-query";
import { AuthQueries } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useEffect } from "react";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api/queryKeys";

export const useAuthInitializer = () => {
  const { setAuthStatus, logout, status } = useAuthState();
  const { data, isError, isLoading } = useQuery({
    ...AuthQueries.validateToken(),
    enabled: status !== "unauthenticated",
  });

  useEffect(() => {
    if (isLoading && !data) {
      setAuthStatus("initializing");
    }
  }, [isLoading, data, setAuthStatus]);

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
          setAuthStatus("authenticated");
        })
        .catch(() => {
          logout();
        });
    }
  }, [data, isError, setAuthStatus, logout]);
};

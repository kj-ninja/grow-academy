import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { FC, ReactElement } from "react";
import { FullPageLoader } from "@/components/ui/FullPageLoader";
import { useAuthState } from "@/features/auth/stores/authStore";

type AuthenticationGuardProps = {
  children?: ReactElement;
  redirectPath?: string;
};

export const AuthenticationGuard: FC<AuthenticationGuardProps> = ({
  redirectPath = "/auth",
  ...props
}) => {
  const authState = useAuthState();

  if (authState.status === "initializing") {
    return <FullPageLoader />;
  }

  const isAllowed = authState.status === "authenticated";

  return (
    <ProtectedRoute
      redirectPath={redirectPath}
      isAllowed={isAllowed}
      {...props}
    />
  );
};

export const UnAuthenticationGuard: FC<AuthenticationGuardProps> = ({
  redirectPath = "/",
  ...props
}) => {
  const authState = useAuthState();

  if (authState.status === "initializing") {
    return <FullPageLoader />;
  }

  const isAllowed = authState.status !== "authenticated";

  return (
    <ProtectedRoute
      redirectPath={redirectPath}
      isAllowed={isAllowed}
      {...props}
    />
  );
};

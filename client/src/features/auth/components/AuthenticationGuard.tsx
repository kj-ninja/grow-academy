import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { FC, ReactElement } from "react";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

export type AuthenticationGuardProps = {
  children?: ReactElement;
  redirectPath?: string;
};

// TODO: remove mocks
export const useAuthState = () => ({
  status: "unauthenticated",
});

export const AuthenticationGuard: FC<AuthenticationGuardProps> = ({ redirectPath = "/auth", ...props }) => {
  const authState = useAuthState();

  if (authState.status === "idle" || authState.status === "initializing") {
    return <FullPageLoader />;
  }

  const isAllowed = authState.status === "authenticated";

  return <ProtectedRoute redirectPath={redirectPath} isAllowed={isAllowed} {...props} />;
};

export const UnAuthenticationGuard: FC<AuthenticationGuardProps> = ({ redirectPath = "/", ...props }) => {
  const authState = useAuthState();

  if (authState.status === "idle" || authState.status === "initializing") {
    return <FullPageLoader />;
  }

  const isAllowed = authState.status !== "authenticated";

  return <ProtectedRoute redirectPath={redirectPath} isAllowed={isAllowed} {...props} />;
};

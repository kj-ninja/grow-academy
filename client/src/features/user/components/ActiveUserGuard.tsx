import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

export const ActiveUserGuard = () => {
  const { isActive } = useCurrentUser();

  if (!isActive) {
    return <Navigate to="onboarding" />;
  }

  return <Outlet />;
};

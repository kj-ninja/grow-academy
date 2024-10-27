import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "@/features/auth/stores/authStore";

export const ActiveUserGuard = () => {
  const { user } = useAuthState();

  if (!user?.isActive) {
    return <Navigate to="onboarding" />;
  }

  return <Outlet />;
};

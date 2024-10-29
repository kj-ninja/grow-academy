import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuthState } from "@/features/auth/stores/authStore";

export const CurrentUserGuard = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuthState();

  if (username && username !== user?.username) {
    return <Navigate to={`/user/${username}`} />;
  }

  return <Outlet />;
};

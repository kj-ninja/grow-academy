import { Navigate, Outlet, useParams } from "react-router-dom";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

export const CurrentUserGuard = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useCurrentUser();

  if (username && currentUser && username !== currentUser?.username) {
    return <Navigate to={`/user/${username}`} />;
  }

  return <Outlet />;
};

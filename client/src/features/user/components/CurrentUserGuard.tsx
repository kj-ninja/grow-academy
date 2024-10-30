import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import zod from "zod";

export const CurrentUserGuard = () => {
  const { username } = useValidateRouteParams({
    username: zod.string().min(1),
  });
  const { currentUser } = useCurrentUser();

  if (currentUser && username !== currentUser?.username) {
    return <Navigate to={`/user/${username}`} />;
  }

  return <Outlet />;
};

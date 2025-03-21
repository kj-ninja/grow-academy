import { Navigate, Outlet } from "react-router-dom";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { z } from "zod";

export const ClassroomOwnerGuard = () => {
  const { id } = useValidateRouteParams({
    id: z.string(),
  });
  const { status } = useAuthState();

  const classroomQuery = useQuery({
    ...ClassroomQueries.details(Number(id)),
    enabled: !!id && status === "authenticated",
  });

  const { isOwner } = useClassroomPolicy(classroomQuery.data);

  if (!isOwner) {
    return <Navigate to={`/classroom/${id}`} />;
  }

  return <Outlet />;
};

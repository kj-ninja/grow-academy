import { Outlet } from "react-router-dom";
import { FullPageLoader } from "@/components/ui/FullPageLoader";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const ClassroomGuard = () => {
  const { handle } = useValidateRouteParams({
    handle: z.string(),
  });

  const classroomQuery = useQuery({
    ...ClassroomQueries.details(handle),
    throwOnError: true,
    retry: false,
  });

  if (classroomQuery.isLoading) {
    return <FullPageLoader />;
  }

  return <Outlet />;
};

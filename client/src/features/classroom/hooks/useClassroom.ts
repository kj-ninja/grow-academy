import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { useQuery } from "@tanstack/react-query";
import zod from "zod";

export const useClassroom = () => {
  const { classroom, handle, classroomQuery } = useMaybeClassroom();

  if (!classroom) {
    throw new Error(
      "useClassroom must be used with a community data already in cache.",
    );
  }

  return {
    classroom,
    classroomQuery,
    handle,
  };
};

export const useMaybeClassroom = () => {
  const { handle } = useValidateRouteParams({
    handle: zod.string().min(1),
  });

  const classroomQuery = useQuery({
    ...ClassroomQueries.details(handle),
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
  });

  const { data: classroom } = classroomQuery;

  return {
    classroom: classroom ?? null,
    classroomQuery,
    handle,
  };
};

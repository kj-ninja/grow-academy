import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import { useQuery } from "@tanstack/react-query";
import zod from "zod";
import { DateTime } from "@/lib/time/time";

export const useClassroom = () => {
  const { classroom, classroomQuery, classroomId } = useMaybeClassroom();

  if (!classroom) {
    throw new Error(
      "useClassroom must be used with a classroom data already in cache.",
    );
  }

  return {
    classroom,
    classroomQuery,
    classroomId,
  };
};

export const useMaybeClassroom = () => {
  const { id } = useValidateRouteParams({
    id: zod.string().min(1),
  });

  const classroomQuery = useQuery({
    ...ClassroomQueries.details(Number(id)),
    refetchOnWindowFocus: true,
    staleTime: DateTime.duration({ seconds: 30 }).as("milliseconds"),
  });

  const { data: classroom } = classroomQuery;

  return {
    classroom: classroom ?? null,
    classroomQuery,
    classroomId: Number(id),
  };
};

import { classroomApi } from "@/features/classroom/api/classroomApi";
import { queryOptions } from "@tanstack/react-query";

export const ClassroomQueries = {
  checkClassroomName: (name: string) =>
    queryOptions({
      queryKey: [name],
      queryFn: () => classroomApi.checkClassroomName(name),
      retry: false,
    }),
  checkClassroomHandle: (handle: string) =>
    queryOptions({
      queryKey: [handle],
      queryFn: () => classroomApi.checkClassroomHandle(handle),
      retry: false,
    }),
};

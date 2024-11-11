import { classroomApi } from "@/features/classroom/api/classroomApi";
import { queryOptions } from "@tanstack/react-query";

export const ClassroomQueries = {
  checkClassroomName: (name: string) =>
    queryOptions({
      queryKey: ["checkClassroomName", name],
      queryFn: () => classroomApi.checkClassroomName(name),
      retry: false,
    }),
  checkClassroomHandle: (handle: string) =>
    queryOptions({
      queryKey: ["checkClassroomHandle", handle],
      queryFn: () => classroomApi.checkClassroomHandle(handle),
      retry: false,
    }),
  details: (handle: string) =>
    queryOptions({
      queryKey: ["classroomDetail", handle],
      queryFn: () => classroomApi.getClassroomDetails(handle),
    }),
};

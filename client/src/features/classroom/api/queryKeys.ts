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
  details: (id: number) =>
    queryOptions({
      queryKey: ["classroom", "details", id],
      queryFn: () => classroomApi.getClassroomDetails(id),
    }),
  pendingRequests: (classroomId: number) =>
    queryOptions({
      queryKey: ["classroom", "requests", classroomId, "pending"],
      queryFn: () => classroomApi.getPendingRequests(classroomId),
    }),
};

import { classroomApi } from "@/features/classroom/api/classroomApi";
import { queryOptions } from "@tanstack/react-query";

export const ClassroomQueries = {
  validateClassroomName: (name: string) =>
    queryOptions({
      queryKey: ["checkClassroomName", name],
      queryFn: () => classroomApi.validateClassroomName(name),
      retry: false,
    }),
  validateClassroomHandle: (handle: string) =>
    queryOptions({
      queryKey: ["checkClassroomHandle", handle],
      queryFn: () => classroomApi.validateClassroomHandle(handle),
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

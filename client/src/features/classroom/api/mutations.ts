import { useMutation } from "@tanstack/react-query";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import { queryClient } from "@/services/ReactQuery";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { useClassroomWebSocket } from "@/features/classroom/websockets/useClassroomWebSocket";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";

export const useCreateClassroomMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => {
      return classroomApi.createClassroom(data);
    },
    onSuccess: () => {
      const pageSize = 10;
      queryClient.invalidateQueries({
        // todo: think about new key like handle from response?
        queryKey: ClassroomInfiniteQueries.classrooms({
          pageSize,
        }).queryKey,
      });
    },
  });
};

export const useJoinClassroomMutation = () => {
  const { sendJoinRequest } = useClassroomWebSocket();
  const { handle } = useClassroom();

  return useMutation({
    mutationFn: (classroomId: number) => {
      return classroomApi.joinClassroom(classroomId);
    },
    onSuccess: ({ message, data }) => {
      // todo: add const or enum
      if (message === "Join request submitted") {
        queryClient.setQueryData(
          ClassroomQueries.details(handle).queryKey,
          (prev) => {
            if (prev) {
              return {
                ...prev,
                isPendingRequest: true,
              };
            }
          },
        );
        sendJoinRequest(data.classroomId);
      }
    },
  });
};

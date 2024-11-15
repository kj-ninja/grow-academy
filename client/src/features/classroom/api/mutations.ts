import { useMutation } from "@tanstack/react-query";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import { queryClient } from "@/services/ReactQuery";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import useClassroomWebSocketActions from "@/features/classroom/websockets/useClassroomWebSocketActions";

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

export const useUpdateClassroomMutation = () => {
  const { handle } = useClassroom();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      return classroomApi.updateClassroom(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ClassroomQueries.details(handle).queryKey,
      });

      // Optionally, you may also want to invalidate any paginated classroom lists or other related data
      // const pageSize = 10;
      // queryClient.invalidateQueries({
      //   queryKey: ClassroomInfiniteQueries.classrooms({ pageSize }).queryKey,
      // });
    },
  });
};

export const useJoinClassroomMutation = () => {
  const { handle } = useClassroom();
  const { sendJoinRequest } = useClassroomWebSocketActions();

  return useMutation({
    mutationFn: (classroomId: number) => {
      return classroomApi.joinClassroom(classroomId);
    },
    onSuccess: ({
      message,
      data,
    }: {
      message: string;
      data: { classroomId: number };
    }) => {
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
      } else {
        queryClient.invalidateQueries({
          queryKey: ClassroomQueries.details(handle).queryKey,
        });
      }
    },
  });
};

export const useCancelJoinRequestMutation = () => {
  const { handle } = useClassroom();

  return useMutation({
    mutationFn: (classroomId: number) => {
      return classroomApi.cancelJoinClassroom(classroomId);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ClassroomQueries.details(handle).queryKey,
        (prev) => {
          if (prev) {
            return {
              ...prev,
              isPendingRequest: false,
            };
          }
        },
      );
    },
  });
};

export const useLeaveClassroomMutation = () => {
  const { handle } = useClassroom();

  return useMutation({
    mutationFn: (classroomId: number) => {
      return classroomApi.leaveClassroom(classroomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ClassroomQueries.details(handle).queryKey,
      });
    },
  });
};

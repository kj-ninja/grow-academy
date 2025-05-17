import { useMutation } from "@tanstack/react-query";
import { classroomApi, ClassroomResponse } from "@/features/classroom/api/classroomApi";
import { queryClient } from "@/services/ReactQuery";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import useClassroomWebSocketActions from "@/features/classroom/websockets/useClassroomWebSocketActions";

const invalidateClassroomDetails = (id: number) => {
  queryClient.invalidateQueries({
    queryKey: ClassroomQueries.details(id).queryKey,
  });
};

const invalidateInfiniteClassrooms = (pageSize: number = 10) => {
  queryClient.invalidateQueries({
    queryKey: ClassroomInfiniteQueries.classrooms({ pageSize }).queryKey,
  });
};

export const useCreateClassroomMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => classroomApi.createClassroom(data),
    onSuccess: () => {
      invalidateInfiniteClassrooms();
    },
  });
};

export const useUpdateClassroomMutation = () => {
  const { classroomId } = useClassroom();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      classroomApi.updateClassroom(id, data),
    onSuccess: () => {
      invalidateClassroomDetails(classroomId);
      queryClient.invalidateQueries({
        queryKey: ClassroomInfiniteQueries.classrooms({}).queryKey.slice(0, 2),
      });
    },
  });
};

export const useJoinClassroomMutation = () => {
  const { classroomId } = useClassroom();
  const { sendJoinRequest } = useClassroomWebSocketActions();

  return useMutation({
    mutationFn: (classroomId: number) => classroomApi.joinClassroom(classroomId),
    onSuccess: ({
      message,
      data,
    }: {
      message: string;
      data: { classroomId: number; updatedClassroom: ClassroomResponse };
    }) => {
      if (message === "Join request submitted") {
        queryClient.setQueryData(
          ClassroomQueries.details(classroomId).queryKey,
          (prev) => (prev ? { ...prev, isPendingRequest: true } : prev)
        );
        sendJoinRequest(data.classroomId);
      } else {
        invalidateClassroomDetails(classroomId);
        invalidateInfiniteClassrooms();
      }
    },
  });
};

export const useLeaveClassroomMutation = () => {
  const { classroomId } = useClassroom();

  return useMutation({
    mutationFn: (classroomId: number) => classroomApi.leaveClassroom(classroomId),
    onSuccess: () => {
      invalidateClassroomDetails(classroomId);
      invalidateInfiniteClassrooms();
    },
  });
};

export const useCancelJoinRequestMutation = () => {
  const { classroomId } = useClassroom();

  return useMutation({
    mutationFn: (classroomId: number) => classroomApi.cancelJoinClassroom(classroomId),
    onSuccess: () => {
      queryClient.setQueryData(ClassroomQueries.details(classroomId).queryKey, (prev) =>
        prev ? { ...prev, isPendingRequest: false } : prev
      );
    },
  });
};

export const useApprovePendingRequestMutation = () => {
  return useMutation({
    mutationFn: ({ classroomId, userId }: { classroomId: number; userId: number }) =>
      classroomApi.approvePendingRequest(classroomId, userId),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ClassroomQueries.pendingRequests(data.classroomId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ClassroomQueries.details(data.classroomId).queryKey,
      });
    },
  });
};

export const useRejectPendingRequestMutation = () => {
  return useMutation({
    mutationFn: ({ classroomId, userId }: { classroomId: number; userId: number }) =>
      classroomApi.rejectPendingRequest(classroomId, userId),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ClassroomQueries.pendingRequests(data.classroomId).queryKey,
      });
    },
  });
};

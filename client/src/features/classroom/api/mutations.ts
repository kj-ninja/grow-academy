import { useMutation } from "@tanstack/react-query";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import { queryClient } from "@/services/ReactQuery";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";

export const useCreateClassroomMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => {
      return classroomApi.createClassroom(data);
    },
    onSuccess: () => {
      const pageSize = 10;
      queryClient.invalidateQueries({
        // todo: think about new key like handle from response
        queryKey: ClassroomInfiniteQueries.classrooms({
          pageSize,
        }).queryKey,
      });
    },
  });
};

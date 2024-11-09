import { useMutation } from "@tanstack/react-query";
import { classroomApi } from "@/features/classroom/api/classroomApi";

export const useCreateClassroomMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => {
      return classroomApi.createClassroom(data);
    },
  });
};

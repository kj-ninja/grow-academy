import {
  classroomApi,
  ClassroomResponse,
} from "@/features/classroom/api/classroomApi";

interface PaginatedResponse<T> {
  classrooms: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const ClassroomInfiniteQueries = {
  classrooms: ({ pageSize = 10 }) => ({
    queryKey: [{ type: "classrooms", pageSize }],
    queryFn: ({ pageParam = 1 }) => {
      return classroomApi.getClassroomList({
        page: pageParam,
        limit: pageSize,
      });
    },
    getNextPageParam: (lastPage: PaginatedResponse<ClassroomResponse>) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  }),
};

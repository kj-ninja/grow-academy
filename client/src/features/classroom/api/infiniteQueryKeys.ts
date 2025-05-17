import { classroomApi, ClassroomResponse } from "@/features/classroom/api/classroomApi";
import { infiniteQueryOptions } from "@tanstack/react-query";

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
  classrooms: ({ pageSize = 10, filterByOwner = false }) =>
    infiniteQueryOptions({
      queryKey: ["classroom", "list", { pageSize, filterByOwner }],
      queryFn: ({ pageParam = 1 }) => {
        return classroomApi.getClassroomList({
          page: pageParam,
          limit: pageSize,
          filterByOwner,
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

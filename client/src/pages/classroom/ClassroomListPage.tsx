import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ClassroomCard } from "@/features/classroom/components/ClassroomCard";
import { InfiniteScrollList } from "@/components/ui/InfiniteScrollList";
import { useClassroomWebSocketListener } from "@/features/classroom/websockets/useClassroomWebSocketListener";

const ClassroomListPage = () => {
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...ClassroomInfiniteQueries.classrooms({
        pageSize: 10,
      }),
    });

  const pages = useMemo(() => {
    return data?.pages.flatMap((page) => page.classrooms) || [];
  }, [data]);

  useClassroomWebSocketListener();

  return (
    <InfiniteScrollList
      data={pages}
      renderItem={(classroom) => (
        <ClassroomCard
          key={classroom.id}
          classroom={classroom}
          onClassroomClick={() => navigate(`/classroom/${classroom.id}`)}
        />
      )}
      onFetchMore={() => fetchNextPage()}
      keyExtractor={(classroom) => classroom.id.toString()}
      isLoading={isFetchingNextPage}
      hasNextPage={hasNextPage}
      className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-8"
    />
  );
};

export const Component = ClassroomListPage;

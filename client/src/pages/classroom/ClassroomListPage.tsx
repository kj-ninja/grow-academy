import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ClassroomCard } from "@/features/classroom/components/ClassroomCard";

const ClassroomListPage = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    ...ClassroomInfiniteQueries.classrooms({
      pageSize: 10,
    }),
  });
  const pages = useMemo(() => {
    return data?.pages.flatMap((page) => page.classrooms) || [];
  }, [data]);

  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-20">
      <div className="flex flex-col max-w-3xl w-full gap-4">
        {pages.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            classroom={classroom}
            onClassroomClick={() => navigate(`/classroom/${classroom.handle}`)}
          />
        ))}
        {hasNextPage && (
          <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export const Component = ClassroomListPage;

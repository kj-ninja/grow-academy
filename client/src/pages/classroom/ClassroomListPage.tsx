import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
      <div className="flex flex-col">
        {pages.map((classroom) => (
          <div
            key={classroom.id}
            onClick={() => navigate(`classroom/${classroom.handle}`)}
          >
            {classroom.classroomName}
          </div>
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

import { useInfiniteQuery } from "@tanstack/react-query";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { useMemo } from "react";
import { ClassroomSettingsTile } from "@/features/classroom/components/ClassroomSettingsTile";

export function UserSettingsClassrooms() {
  const { data } = useInfiniteQuery({
    ...ClassroomInfiniteQueries.classrooms({
      pageSize: 10,
      filterByOwner: true,
    }),
  });

  const pages = useMemo(() => {
    return data?.pages.flatMap((page) => page.classrooms) || [];
  }, [data]);

  // todo: add skeletons and empty state
  return (
    <div className="flex flex-col gap-2 p-4">
      {pages.map((classroom) => (
        <ClassroomSettingsTile key={classroom.id} classroom={classroom} />
      ))}
    </div>
  );
}
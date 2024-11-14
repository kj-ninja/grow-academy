import { useInfiniteQuery } from "@tanstack/react-query";
import { ClassroomInfiniteQueries } from "@/features/classroom/api/infiniteQueryKeys";
import { useMemo, useState } from "react";
import { UserSettingsClassroomTile } from "@/features/user/components/settings/UserSettingsClassroomTile";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { CreateClassroomModal } from "@/features/classroom/components/CreateClassroomModal";

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

  const [isCreateClassroomModalOpen, setIsCreateClassroomModalOpen] =
    useState(false);

  // todo: add data after success creation and remove previous user data

  return (
    <div className="flex flex-col gap-2 p-4">
      {pages.length > 0 ? (
        pages.map((classroom) => (
          <UserSettingsClassroomTile key={classroom.id} classroom={classroom} />
        ))
      ) : (
        <div className="flex gap-2 items-center">
          <Text type="body">
            You have no Classrooms yet. Feel free to create one
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCreateClassroomModalOpen(true)}
          >
            Create Classroom
          </Button>
        </div>
      )}

      {isCreateClassroomModalOpen && (
        <CreateClassroomModal
          isOpen={isCreateClassroomModalOpen}
          setIsOpen={setIsCreateClassroomModalOpen}
        />
      )}
    </div>
  );
}

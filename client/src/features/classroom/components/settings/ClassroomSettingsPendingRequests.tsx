import { useQuery } from "@tanstack/react-query";
import { ClassroomQueries } from "@/features/classroom/api/queryKeys";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { ClassroomSettingsMember } from "@/features/classroom/components/settings/ClassroomSettingsMember";
import { Text } from "@/components/ui/Text/Text";
import { PendingActions } from "@/features/classroom/components/settings/PendingActions";

export function ClassroomSettingsPendingRequests() {
  const { classroom } = useClassroom();

  const { data } = useQuery({
    ...ClassroomQueries.pendingRequests(classroom.id),
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      {data && data?.length > 0 ? (
        data?.map(({ user }) => (
          <ClassroomSettingsMember
            key={user.id}
            member={user}
            ActionsComponent={PendingActions}
          />
        ))
      ) : (
        <div className="flex gap-2 items-center">
          <Text type="body">You have no pending request yet.</Text>
        </div>
      )}
    </div>
  );
}

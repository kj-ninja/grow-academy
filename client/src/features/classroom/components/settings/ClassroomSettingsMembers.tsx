import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { ClassroomSettingsMember } from "@/features/classroom/components/settings/ClassroomSettingsMember";
import { Text } from "@/components/ui/Text/Text";

export function ClassroomSettingsMembers() {
  const { classroom } = useClassroom();

  return (
    <div className="flex flex-col gap-2 p-4">
      {classroom.members.length > 0 ? (
        classroom.members.map((member) => (
          <ClassroomSettingsMember key={member.id} member={member} />
        ))
      ) : (
        <div className="flex items-center gap-2">
          <Text type="body">You have no Members yet.</Text>
        </div>
      )}
    </div>
  );
}

import { ClassroomDetailsLayout } from "@/features/classroom/components/ClassroomDetailsLayout";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";

export function ClassroomMemberView() {
  const { classroom } = useClassroom();
  const { isOwner } = useClassroomPolicy(classroom);

  return (
    <ClassroomDetailsLayout>
      <div className="flex items-center">
        <Text type="body">Classroom: {classroom.classroomName}</Text>
        {isOwner && (
          <Button
            className="ml-4"
            onClick={() => console.log("edit classroom")}
          >
            Edit Classroom
          </Button>
        )}
      </div>
    </ClassroomDetailsLayout>
  );
}

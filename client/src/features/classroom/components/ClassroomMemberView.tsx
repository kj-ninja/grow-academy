import { ClassroomDetailsLayout } from "@/features/classroom/components/ClassroomDetailsLayout";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export function ClassroomMemberView() {
  const { classroom } = useClassroom();
  const { isOwner } = useClassroomPolicy(classroom);

  const navigate = useNavigate();

  return (
    <ClassroomDetailsLayout>
      <div className="flex items-center">
        <Text type="body">Classroom: {classroom.classroomName}</Text>
        {isOwner && (
          <Button
            className="ml-4"
            onClick={() =>
              navigate(`/classroom/${classroom.handle}/settings/edit`)
            }
          >
            Edit Classroom
          </Button>
        )}
      </div>
    </ClassroomDetailsLayout>
  );
}

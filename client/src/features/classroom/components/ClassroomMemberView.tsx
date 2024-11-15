import { ClassroomDetailsLayout } from "@/features/classroom/components/ClassroomDetailsLayout";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { useLeaveClassroomMutation } from "@/features/classroom/api/mutations";

export function ClassroomMemberView() {
  const { classroom } = useClassroom();
  const { isOwner } = useClassroomPolicy(classroom);
  const leaveClassroom = useLeaveClassroomMutation();

  const navigate = useNavigate();

  const handleLeaveClassroom = async () => {
    try {
      await leaveClassroom.mutateAsync(classroom.id);
    } catch (error) {
      console.error("Error leaving classroom", error);
    }
  };

  const button = isOwner ? (
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        navigate(`/classroom/${classroom.handle}/settings/profile`)
      }
    >
      <Settings size={18} />
      Edit Profile
    </Button>
  ) : (
    <Button onClick={handleLeaveClassroom} disabled={leaveClassroom.isPending}>
      Leave Classroom
    </Button>
  );

  return <ClassroomDetailsLayout button={button} />;
}

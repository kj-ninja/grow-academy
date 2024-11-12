import { ClassroomDetailsLayout } from "@/features/classroom/components/ClassroomDetailsLayout";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { useJoinClassroomMutation } from "@/features/classroom/api/mutations";

export function ClassroomGuestView() {
  const { classroom } = useClassroom();
  const { isPendingRequest } = useClassroomPolicy(classroom);
  const { mutateAsync } = useJoinClassroomMutation();

  const handleJoinRequest = async () => {
    try {
      await mutateAsync(classroom.id);
    } catch (error) {
      // todo: add error handler
      console.log("Error", error);
    }
  };

  return (
    <ClassroomDetailsLayout>
      <div className="flex items-center">
        <Text type="body">Classroom: {classroom.classroomName}</Text>
        <Button
          className="ml-4"
          onClick={handleJoinRequest}
          disabled={isPendingRequest}
        >
          {isPendingRequest ? "Pending Request" : "Join Classroom"}
        </Button>
      </div>
    </ClassroomDetailsLayout>
  );
}

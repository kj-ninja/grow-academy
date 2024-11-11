import { ClassroomDetailsLayout } from "@/features/classroom/components/ClassroomDetailsLayout";
import { Text } from "@/components/ui/Text/Text";
import { Button } from "@/components/ui/Button";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";

export function ClassroomGuestView() {
  const { classroom } = useClassroom();
  const { isPendingRequest } = useClassroomPolicy(classroom);

  return (
    <ClassroomDetailsLayout>
      <div className="flex items-center">
        <Text type="body">Classroom: {classroom.classroomName}</Text>
        <Button
          className="ml-4"
          onClick={() => console.log("join classroom")}
          disabled={isPendingRequest}
        >
          {isPendingRequest ? "Pending Request" : "Join Classroom"}
        </Button>
      </div>
    </ClassroomDetailsLayout>
  );
}

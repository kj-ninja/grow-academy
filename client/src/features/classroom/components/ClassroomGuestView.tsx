import { ClassroomDetailsLayout } from "@/features/classroom/components/ClassroomDetailsLayout";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import {
  useCancelJoinRequestMutation,
  useJoinClassroomMutation,
} from "@/features/classroom/api/mutations";
import { Button } from "@/components/ui/Button";

export function ClassroomGuestView() {
  const { classroom } = useClassroom();
  const { mustRequestToJoin, isPendingRequest } = useClassroomPolicy(classroom);
  const joinClassroom = useJoinClassroomMutation();
  const cancelJoinRequest = useCancelJoinRequestMutation();

  const handleJoinClassroom = async () => {
    try {
      await joinClassroom.mutateAsync(classroom.id);
    } catch (error) {
      // todo: add error handler
      console.log("Error", error);
    }
  };

  const handleCancelJoinRequest = async () => {
    try {
      await cancelJoinRequest.mutateAsync(classroom.id);
    } catch (error) {
      // todo: add error handler
      console.log("Error", error);
    }
  };

  const joinButton = (
    <Button
      onClick={handleJoinClassroom}
      disabled={isPendingRequest || joinClassroom.isPending}
    >
      {mustRequestToJoin
        ? "Request to Join"
        : isPendingRequest
          ? "Request Pending"
          : "Join Classroom"}
    </Button>
  );

  const cancelJoinButton = (
    <Button
      variant="outline"
      onClick={handleCancelJoinRequest}
      disabled={cancelJoinRequest.isPending}
    >
      Cancel Join Request
    </Button>
  );

  return (
    <ClassroomDetailsLayout
      button={isPendingRequest ? cancelJoinButton : joinButton}
    />
  );
}

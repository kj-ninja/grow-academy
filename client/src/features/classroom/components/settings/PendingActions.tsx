import { SimpleUser } from "@/features/auth/stores/authStore";
import { Button } from "@/components/ui/Button";
import {
  useApprovePendingRequestMutation,
  useRejectPendingRequestMutation,
} from "@/features/classroom/api/mutations";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import useClassroomWebSocketActions from "@/features/classroom/websockets/useClassroomWebSocketActions";

export function PendingActions({ member }: { member: SimpleUser }) {
  const approveMember = useApprovePendingRequestMutation();
  const rejectMember = useRejectPendingRequestMutation();

  const { classroom } = useClassroom();
  const { approveJoinRequest, rejectJoinRequest } = useClassroomWebSocketActions();

  const handleApprove = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await approveMember.mutateAsync({
        classroomId: classroom.id,
        userId: id,
      });
      approveJoinRequest(classroom.id, id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await rejectMember.mutateAsync({
        classroomId: classroom.id,
        userId: id,
      });
      rejectJoinRequest(classroom.id, id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button onClick={(event) => handleApprove(member.id, event)}>Approve</Button>
      <Button variant="outline" onClick={(event) => handleReject(member.id, event)}>
        Reject
      </Button>
    </>
  );
}

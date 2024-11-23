import { useClassroom } from "@/features/classroom/hooks/useClassroom";
import { useClassroomPolicy } from "@/features/classroom/policies/useClassroomPolicy";
import { ClassroomGuestView } from "@/features/classroom/components/ClassroomGuestView";
import { ClassroomMemberView } from "@/features/classroom/components/ClassroomMemberView";
import { useClassroomWebSocketListener } from "@/features/classroom/websockets/useClassroomWebSocketListener";

function ClassroomProfilePage() {
  const { classroom } = useClassroom();
  const { isConnected } = useClassroomPolicy(classroom);

  useClassroomWebSocketListener();

  if (!isConnected) {
    return <ClassroomGuestView />;
  }

  return <ClassroomMemberView />;
}

export const Component = ClassroomProfilePage;

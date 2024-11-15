import { useWebSocket } from "@/services/WebSocket/WebSocket.context";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

const useClassroomWebSocketActions = () => {
  const socket = useWebSocket();
  const { currentUser } = useCurrentUser();

  const sendJoinRequest = (classroomId: number) => {
    if (currentUser && socket) {
      socket.emit("join-request", { classroomId, userId: currentUser.id });
    } else {
      console.warn(
        "Cannot send join request: User or socket is not available.",
      );
    }
  };

  return { sendJoinRequest };
};

export default useClassroomWebSocketActions;

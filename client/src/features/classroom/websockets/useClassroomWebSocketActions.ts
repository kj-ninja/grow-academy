import { useWebSocket } from "@/services/WebSocket/WebSocket.context";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

const useClassroomWebSocketActions = () => {
  const socket = useWebSocket();
  const { currentUser } = useCurrentUser();

  const sendJoinRequest = (classroomId: number) => {
    if (currentUser && socket) {
      socket.emit("join-request", { classroomId, userId: currentUser.id });
    } else {
      console.warn("Cannot send join request: User or socket is not available.");
    }
  };

  const approveJoinRequest = (classroomId: number, userId: number) => {
    if (currentUser && socket) {
      socket.emit("approve-join-request", { classroomId, userId });
    } else {
      console.warn("Cannot approve join request: User or socket is not available.");
    }
  };

  const rejectJoinRequest = (classroomId: number, userId: number) => {
    if (currentUser && socket) {
      socket.emit("reject-join-request", { classroomId, userId });
    } else {
      console.warn("Cannot reject join request: User or socket is not available.");
    }
  };

  return { sendJoinRequest, approveJoinRequest, rejectJoinRequest };
};

export default useClassroomWebSocketActions;

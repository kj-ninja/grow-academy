import { useEffect } from "react";
import { useWebSocket } from "@/services/WebSocket/WebSocketContext";
import { Socket } from "socket.io-client";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

export function useClassroomWebSocket() {
  const socket: Socket = useWebSocket();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    socket.on("join-request-pending", (data: { message: string }) => {
      alert(`Server message: ${data.message}`);
    });

    socket.on("join-request-approved", (data: { message: string }) => {
      alert(`Server message: ${data.message}`);
    });

    socket.on("join-request-rejected", (data: { message: string }) => {
      alert(`Server message: ${data.message}`);
    });

    return () => {
      socket.off("join-request-pending");
      socket.off("join-request-approved");
      socket.off("join-request-rejected");
    };
  }, [socket]);

  const sendJoinRequest = (classroomId: number) => {
    if (currentUser) {
      socket.emit("join-request", { classroomId, userId: currentUser.id });
    }
  };

  return { sendJoinRequest };
}

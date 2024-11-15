import { useEffect } from "react";
import { useWebSocket } from "@/services/WebSocket/WebSocket.context";
import { useToast } from "@/hooks/useToast";

interface JoinRequestPayload {
  message: string;
  data?: {
    classroomId: number;
    userId: number;
  };
}

interface NotificationData {
  message: string;
  classroomId: number;
  userId: number;
  userName: string;
  classroomName: string;
}

// todo: move it?
export const ClassroomWebSocketListener = () => {
  const socket = useWebSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    const handleJoinRequestPending = (payload: JoinRequestPayload) => {
      toast({
        title: payload.message,
        description: "Owner will approve or reject your request.",
      });
    };

    const handleJoinRequestApproved = (data: { message: string }) => {
      toast({
        title: "Join Request Approved",
        description: data.message,
      });
    };

    const handleJoinRequestRejected = (data: { message: string }) => {
      toast({
        title: "Join Request Rejected",
        description: data.message,
      });
    };

    const handleJoinRequestNotification = (data: NotificationData) => {
      toast({
        title: data.message,
        description: `Go to classroom ${data.classroomName} settings to approve or reject the request from ${data.userName}.`,
      });
    };

    socket.on("join-request-pending", handleJoinRequestPending);
    socket.on("join-request-approved", handleJoinRequestApproved);
    socket.on("join-request-rejected", handleJoinRequestRejected);
    socket.on("join-request-notification", handleJoinRequestNotification);

    return () => {
      socket.off("join-request-pending", handleJoinRequestPending);
      socket.off("join-request-approved", handleJoinRequestApproved);
      socket.off("join-request-rejected", handleJoinRequestRejected);
      socket.off("join-request-notification", handleJoinRequestNotification);
    };
  }, [socket, toast]);

  return null;
};

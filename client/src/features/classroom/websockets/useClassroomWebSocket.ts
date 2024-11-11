import { useEffect } from "react";
import { useWebSocket } from "@/services/WebSocketProvider";

export function useClassroomWebSocket() {
  const socket = useWebSocket();

  useEffect(() => {
    // Example: Listening for a classroom-specific event
    socket.on("join-request-pending", (data) => {
      console.log("Classroom join request pending:", data);
    });

    // Example: Listening for another classroom-related event
    socket.on("join-request-approved", (data) => {
      console.log("Classroom join request approved:", data);
    });

    // Cleanup: Unsubscribe from events when component using this hook unmounts
    return () => {
      socket.off("join-request-pending");
      socket.off("join-request-approved");
    };
  }, [socket]);

  // Return any helper functions or data you want to expose
  return {
    sendJoinRequest: (classroomId: number) => {
      socket.emit("join-classroom", { classroomId });
    },
  };
}

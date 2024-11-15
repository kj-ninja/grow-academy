import { Socket } from "socket.io";
import { handleJoinRequest } from "services/WebSocket";

export function classroomEvents(socket: Socket) {
  socket.on(
    "join-request",
    async (data: { classroomId: number; userId: number }) => {
      try {
        await handleJoinRequest(socket, data);
      } catch (error) {
        console.error("Error handling join request:", error);
        socket.emit("error", { message: "Failed to handle join request" });
      }
    },
  );
}

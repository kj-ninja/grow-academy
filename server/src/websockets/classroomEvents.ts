import { Socket } from "socket.io";
import {
  handleApproveJoinRequest,
  handleJoinRequest,
  rejectJoinRequest,
} from "services/WebSocket";

export function classroomEvents(socket: Socket) {
  socket.on("join-request", async (data: { classroomId: number; userId: number }) => {
    try {
      await handleJoinRequest(socket, data);
    } catch (error) {
      console.error("Error handling join request:", error);
      socket.emit("error", { message: "Failed to handle join request" });
    }
  });
  socket.on(
    "approve-join-request",
    async (data: { classroomId: number; userId: number }) => {
      try {
        await handleApproveJoinRequest(socket, data);
      } catch (error) {
        console.error("Error handling approve join request:", error);
        socket.emit("error", {
          message: "Failed to handle approve join request",
        });
      }
    }
  );
  socket.on(
    "reject-join-request",
    async (data: { classroomId: number; userId: number }) => {
      try {
        await rejectJoinRequest(socket, data);
      } catch (error) {
        console.error("Error handling reject join request:", error);
        socket.emit("error", {
          message: "Failed to handle reject join request",
        });
      }
    }
  );
}

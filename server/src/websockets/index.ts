import { Server as SocketIOServer, Socket } from "socket.io";
import { classroomEvents } from "websockets/classroomEvents";

export function setupWebSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    classroomEvents(socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

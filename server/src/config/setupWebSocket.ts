import { Server as SocketIOServer, Socket } from "socket.io";
import { classroomEvents } from "websockets/classroomEvents";
import { registerUserSocket } from "services/WebSocket";

export function setupWebSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      console.log(
        `Registering user socket: userId=${userId}, socketId=${socket.id}`,
      );
      registerUserSocket(Number(userId), socket.id);
    }
    classroomEvents(socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

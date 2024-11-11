import { Server as SocketIOServer, Socket } from "socket.io";

export function setupWebSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

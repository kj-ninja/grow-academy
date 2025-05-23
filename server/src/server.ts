import { setupWebSocket } from "config/setupWebSocket";
import app from "./app";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const PORT = process.env.PORT || 4000;

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
setupWebSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { Socket } from "socket.io";

export function classroomEvents(socket: Socket) {
  socket.on("join-request", (data: { classroomId: number; userId: number }) => {
    console.log(
      `Received join request for classroom ${data.classroomId} from user ${data.userId}`,
    );

    socket.emit("join-request-pending", {
      message: "Your request is pending.",
    });
  });
}

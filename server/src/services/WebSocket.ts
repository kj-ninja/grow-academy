import { Socket } from "socket.io";
import { getUserById } from "services/User";
import { findClassroomById } from "services/Classroom";

interface ActiveUsers {
  [userId: number]: string;
}

const activeUsers: ActiveUsers = {}; // In-memory store for active socket connections

export function registerUserSocket(userId: number, socketId: string) {
  activeUsers[userId] = socketId;
}

export function getUserSocketId(userId: number) {
  return activeUsers[userId];
}

export async function handleJoinRequest(
  socket: Socket,
  data: { classroomId: number; userId: number },
) {
  const user = await getUserById(data.userId);
  const classroom = await findClassroomById(data.classroomId);

  if (classroom && user) {
    const ownerSocketId = getUserSocketId(classroom.ownerId);

    if (ownerSocketId) {
      socket.to(ownerSocketId).emit("join-request-notification", {
        message: `Hey user ${user.username} sent a request to join your classroom '${classroom.classroomName}'`,
        classroomId: data.classroomId,
        userId: data.userId,
        userName: user.username,
        classroomName: classroom.classroomName,
      });
    } else {
      console.log(`Owner (userId=${classroom.ownerId}) is not connected.`);
    }
  }

  socket.emit("join-request-pending", {
    message: "Your request is pending.",
  });
}

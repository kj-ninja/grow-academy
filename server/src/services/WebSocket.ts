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
        message: `User '${user.username}' sent a request to join '${classroom.classroomName}'`,
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

export async function handleApproveJoinRequest(
  socket: Socket,
  data: { classroomId: number; userId: number },
) {
  const user = await getUserById(data.userId);
  const classroom = await findClassroomById(data.classroomId);

  if (classroom && user) {
    const userSocketId = getUserSocketId(data.userId);

    if (userSocketId) {
      socket.to(userSocketId).emit("join-request-approved", {
        message: `Your request to join '${classroom.classroomName}' has been approved.`,
        classroomId: data.classroomId,
      });
    } else {
      console.log(`User (userId=${data.userId}) is not connected.`);
    }
  }
}

export async function rejectJoinRequest(
  socket: Socket,
  data: { classroomId: number; userId: number },
) {
  const user = await getUserById(data.userId);
  const classroom = await findClassroomById(data.classroomId);

  if (classroom && user) {
    const userSocketId = getUserSocketId(data.userId);

    if (userSocketId) {
      socket.to(userSocketId).emit("join-request-rejected", {
        message: `Your request to join '${classroom.classroomName}' has been rejected.`,
        classroomId: data.classroomId,
      });
    } else {
      console.log(`User (userId=${data.userId}) is not connected.`);
    }
  }
}

import { Socket } from "socket.io";

/**
 * Active user mapping for WebSocket connections
 */
export interface ActiveUsers {
  [userId: number]: string; // Maps user ID to socket ID
}

/**
 * Join request event payload
 */
export interface JoinRequestEventData {
  classroomId: number;
  userId: number;
}

/**
 * Join request notification payload
 */
export interface JoinRequestNotificationData {
  message: string;
  classroomId: number;
  userId: number;
  userName: string;
  classroomName: string;
}

/**
 * Event handler type for WebSocket events
 */
export type WebSocketEventHandler<T = any> = (
  socket: Socket,
  data: T,
) => Promise<void>;

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export const WebSocketContext = createContext<Socket<
  DefaultEventsMap,
  DefaultEventsMap
> | null>(null);

export const useWebSocket = () => {
  const socket = useContext(WebSocketContext);
  if (!socket) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return socket;
};

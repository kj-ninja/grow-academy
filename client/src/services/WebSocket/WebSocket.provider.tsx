import React, { PropsWithChildren, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { WebSocketContext } from "./WebSocket.context";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const { currentUser } = useCurrentUser();
  const [socketClient, setSocketClient] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    if (socketClient?.connected) {
      return;
    }

    if (currentUser?.id) {
      const socket = io("http://localhost:4000", {
        query: { userId: currentUser.id },
      });

      socket.on("connect", () => {
        console.log(`Connected to WebSocket server with ID: ${socket.id}`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Disconnected from WebSocket server. Reason: ${reason}`);
      });

      socket.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnection attempt #${attempt}`);
      });

      socket.on("reconnect", (attempt) => {
        console.log(`Reconnected after ${attempt} attempt(s)`);
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      setSocketClient(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [currentUser]);

  return (
    <WebSocketContext.Provider value={socketClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

import React, { PropsWithChildren, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { WebSocketContext } from "./WebSocket.context";

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [socketClient] = useState(() => io("http://localhost:4000"));

  useEffect(() => {
    if (socketClient.connected) {
      return;
    }

    socketClient.on("connect", () => {
      console.log(`Connected to WebSocket server with ID: ${socketClient.id}`);
    });

    socketClient.on("disconnect", (reason) => {
      console.log(`Disconnected from WebSocket server. Reason: ${reason}`);
    });

    socketClient.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt #${attempt}`);
    });

    socketClient.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempt(s)`);
    });

    socketClient.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socketClient.connect();

    return () => {
      if (socketClient) {
        socketClient.disconnect();
      }
    };
  }, [socketClient]);

  return (
    <WebSocketContext.Provider value={socketClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

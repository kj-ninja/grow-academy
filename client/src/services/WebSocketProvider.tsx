import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const WebSocketContext = createContext<Socket<
  DefaultEventsMap,
  DefaultEventsMap
> | null>(null);

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null,
  );

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect", () => {
      console.log(
        `Connected to WebSocket server with ID: ${socketRef.current?.id}`,
      );
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log(`Disconnected from WebSocket server. Reason: ${reason}`);
    });

    socketRef.current.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt #${attempt}`);
    });

    socketRef.current.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempt(s)`);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socketRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

// todo: think about this rule
// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => {
  const socket = useContext(WebSocketContext);
  if (!socket) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return socket;
};

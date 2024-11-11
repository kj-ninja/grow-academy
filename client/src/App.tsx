import { RouterProvider } from "@/pages/router";
import { useAuthInitializer } from "@/features/auth/hooks/useAuthInitializer";
import { Toaster } from "@/components/ui/Toaster";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { WebSocketProvider } from "@/services/WebSocketProvider";

const socket = io("http://localhost:4000");

function App() {
  useAuthInitializer();

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connected with socket ID: ${socket.id}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <WebSocketProvider>
      <RouterProvider />
      <Toaster />
    </WebSocketProvider>
  );
}

export default App;

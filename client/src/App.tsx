import { RouterProvider } from "@/pages/router";
import { useAuthInitializer } from "@/features/auth/hooks/useAuthInitializer";
import { Toaster } from "@/components/ui/Toaster";
import { WebSocketProvider } from "@/services/WebSocket/WebSocket.provider";

function App() {
  useAuthInitializer();

  return (
    <WebSocketProvider>
      <RouterProvider />
      <Toaster />
    </WebSocketProvider>
  );
}

export default App;

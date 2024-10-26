import { RouterProvider } from "@/pages/router";
import { useAuthInitializer } from "@/features/auth/hooks/useAuthInitializer";
import { Toaster } from "@/components/ui/Toaster";

function App() {
  useAuthInitializer();

  return (
    <>
      <RouterProvider />
      <Toaster />
    </>
  );
}

export default App;

import { RouterProvider } from "@/pages/router";
import { queryClient } from "@/services/ReactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuthInitializer } from "@/features/auth/hooks/useAuthInitializer";
import { Toaster } from "@/components/ui/Toaster";

function App() {
  useAuthInitializer();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

import { RouterProvider } from "@/pages/router";
import { queryClient } from "@/services/ReactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuthInitializer } from "@/features/auth/hooks/useAuthInitializer";

function App() {
  useAuthInitializer();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
    </QueryClientProvider>
  );
}

export default App;

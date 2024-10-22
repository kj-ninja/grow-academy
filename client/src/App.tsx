import { RouterProvider } from "@/pages/router";
import { queryClient } from "@/services/ReactQuery";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
    </QueryClientProvider>
  );
}

export default App;

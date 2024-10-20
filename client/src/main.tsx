import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { queryClient } from "@/services/ReactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@/pages/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
    </QueryClientProvider>
  </StrictMode>
);

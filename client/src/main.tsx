import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "./index.css";
import { queryClient } from "@/services/ReactQuery";
import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

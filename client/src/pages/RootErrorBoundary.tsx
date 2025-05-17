import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function RootErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <p>Oops! Something went wrong 😞</p>
      <p>{error.message || JSON.stringify(error)}</p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  );
}

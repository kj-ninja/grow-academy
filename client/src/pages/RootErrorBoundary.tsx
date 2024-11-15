import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function RootErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <p>Oops! Something went wrong 😞</p>
      <p>{error.message || JSON.stringify(error)}</p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 space-y-4">
      <h2>Nothing to see here!</h2>
      <Button variant="link" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen space-y-4">
      <h2>Nothing to see here!</h2>
      <Button size="sm" variant="link" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  );
};

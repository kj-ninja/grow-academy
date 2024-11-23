import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text/Text";

export const ClassroomProfileErrorElement = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const errorMessage =
    error instanceof Error && "status" in error && error.status === 404
      ? "Classroom not found"
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-screen">
      <Text type="h1">{errorMessage}</Text>
      <Button onClick={() => navigate("/")}>Go to home</Button>
    </div>
  );
};

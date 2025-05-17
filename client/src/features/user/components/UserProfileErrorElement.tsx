import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const UserProfileErrorElement = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <p>User not found 😞</p>
      <Button onClick={() => navigate("/")}>Go to home</Button>
    </div>
  );
};

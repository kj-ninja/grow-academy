import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const UserProfileErrorElement = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <p>User not found 😞</p>
      <Button onClick={() => navigate("/")}>Go to home</Button>
    </div>
  );
};

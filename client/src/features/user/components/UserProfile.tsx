import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserQueries } from "@/features/user/api";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import zod from "zod";

export function UserProfile() {
  const { username } = useValidateRouteParams({
    username: zod.string().min(1),
  });
  const { data } = useQuery(UserQueries.getUser(username));

  const navigate = useNavigate();

  return (
    <div className="flex gap-4 items-center">
      <div>Username: {data?.username}</div>
      <Button variant="default" onClick={() => navigate("settings/edit")}>
        Edit
      </Button>
    </div>
  );
}

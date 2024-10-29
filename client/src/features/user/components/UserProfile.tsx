import { useQuery } from "@tanstack/react-query";
import { UserQueries } from "@/features/user/api";
import { useValidateRouteParams } from "@/hooks/useValidateRouteParams";
import zod from "zod";

export function UserProfile() {
  const { username } = useValidateRouteParams({
    username: zod.string().min(1),
  });

  const { data } = useQuery(UserQueries.getUser(username));
  console.log("data", data);

  return <div>Username: {data.username}</div>;
}

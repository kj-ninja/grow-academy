import { UserProfile } from "@/features/user/components/UserProfile";
import { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api/queryKeys";

function UserProfilePage() {
  return (
    <div className="flex justify-center mt-20">
      <UserProfile />
    </div>
  );
}

export const Component = UserProfilePage;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.username) {
    throw new Error("No username provided");
  }

  const userQuery = await queryClient.fetchQuery({
    ...UserQueries.getUser(params.username || ""),
  });

  if (!userQuery) {
    throw new Error("No user found");
  }

  return userQuery;
};

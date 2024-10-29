import { UserProfile } from "@/features/user/components/UserProfile";
import { LoaderFunctionArgs } from "react-router-dom";
import { UserQueries } from "@/features/user/api";
import { queryClient } from "@/services/ReactQuery";
import { User } from "@/features/auth/stores/authStore";

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

  console.log("params.username: ", params.username);

  const userQuery: User = await queryClient.fetchQuery({
    ...UserQueries.getUser(params.username),
  });

  console.log("userQuery: ", userQuery);

  if (!userQuery) {
    throw new Error("No user found");
  }

  return userQuery;
};

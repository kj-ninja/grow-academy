import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";
import { LoaderFunctionArgs } from "react-router-dom";
import { User } from "@/features/auth/stores/authStore";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api";

function UserSettingsPage() {
  return (
    <AuthPage title="Onboarding" description="Please finish your registration">
      <UpdateUserProfileForm />
    </AuthPage>
  );
}

export const Component = UserSettingsPage;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.username) {
    throw new Error("No username provided");
  }

  const userQuery: User = await queryClient.fetchQuery({
    ...UserQueries.getUser(params.username),
  });

  if (!userQuery) {
    throw new Error("No user found");
  }

  return userQuery;
};

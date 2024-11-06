import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";

function UserSettingsPage() {
  return (
    <AuthPage title="Edit Profile">
      <UpdateUserProfileForm />
    </AuthPage>
  );
}

export const Component = UserSettingsPage;

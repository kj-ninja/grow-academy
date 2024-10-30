import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";

function UserSettingsPage() {
  return (
    <AuthPage title="Onboarding" description="Please finish your registration">
      <UpdateUserProfileForm />
    </AuthPage>
  );
}

export const Component = UserSettingsPage;

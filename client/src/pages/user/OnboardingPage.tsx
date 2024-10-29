import { AuthPage } from "@/components/layout/pages/AuthPage";
import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { useAuthState } from "@/features/auth/stores/authStore";
import { Navigate } from "react-router-dom";

function OnboardingPage() {
  const { user, status } = useAuthState();

  if (status === "authenticated" && user?.isActive) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthPage title="Onboarding" description="Please finish your registration">
      <UpdateUserProfileForm />
    </AuthPage>
  );
}

export const Component = OnboardingPage;

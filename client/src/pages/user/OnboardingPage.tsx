import { AuthPage } from "@/components/layout/pages/AuthPage";
import { UpdateUserProfileForm } from "@/features/user/forms/UpdateUserProfileForm";
import { useAuthState } from "@/features/auth/stores/authStore";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";

function OnboardingPage() {
  const { status } = useAuthState();
  const { isActive } = useCurrentUser();

  if (status === "authenticated" && isActive) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthPage
      title="Create your profile"
      description="Please finish your registration before we start"
    >
      <UpdateUserProfileForm />
    </AuthPage>
  );
}

export const Component = OnboardingPage;

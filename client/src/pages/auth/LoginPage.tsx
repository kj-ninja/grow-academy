import { AuthPage } from "@/components/layout/pages/AuthPage";
import { LoginForm } from "@/features/auth/forms/LoginForm";

export function LoginPage() {
  return (
    <AuthPage title="Login" description="If you already have account.">
      <LoginForm />
    </AuthPage>
  );
}

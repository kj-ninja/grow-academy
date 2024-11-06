import { AuthPage } from "@/components/layout/pages/AuthPage";
import { RegisterForm } from "@/features/auth/forms/RegisterForm";

export function RegisterPage() {
  return (
    <AuthPage
      title="Create account"
      description="Welcome! Create an account and learn with others!"
    >
      <RegisterForm />
    </AuthPage>
  );
}

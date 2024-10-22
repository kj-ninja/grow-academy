import { AuthForm } from "@/features/auth/forms/AuthForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";
import { AuthFormValues } from "@/features/auth/forms/AuthForm.schema";

export function RegisterPage() {
  const handleRegister = async (values: AuthFormValues) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <AuthPage title="Create account" description="Welcome! Create an account and learn with others!">
      <AuthForm onSubmit={handleRegister} />
    </AuthPage>
  );
}

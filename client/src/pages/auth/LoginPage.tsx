import { AuthForm } from "@/features/auth/forms/AuthForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";
import { AuthFormValues } from "@/features/auth/forms/AuthForm.schema";

export function LoginPage() {
  const handleLogin = async (values: AuthFormValues) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <AuthPage title="Login" description="Welcome back! Login and have fun!">
      <AuthForm onSubmit={handleLogin} />
    </AuthPage>
  );
}

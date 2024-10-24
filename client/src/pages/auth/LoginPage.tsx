import { AuthForm } from "@/features/auth/forms/AuthForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";
import { AuthFormValues } from "@/features/auth/forms/AuthForm.schema";
import { useLoginMutation } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const { setAuthState } = useAuthState();

  const handleLogin = async (credentials: AuthFormValues) => {
    const loginResponse = await loginMutation.mutateAsync({
      username: credentials.username,
      password: credentials.password,
    });
    setAuthState({ status: "authenticated", user: loginResponse.user });
  };

  return (
    <AuthPage title="Login" description="Welcome back! Login and have fun!">
      <AuthForm onSubmit={handleLogin} />
    </AuthPage>
  );
}

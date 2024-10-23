import { AuthForm } from "@/features/auth/forms/AuthForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";
import { AuthFormValues } from "@/features/auth/forms/AuthForm.schema";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";

export function RegisterPage() {
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const { setAuthState } = useAuthState();

  const handleRegister = async (credentials: AuthFormValues) => {
    try {
      await registerMutation.mutateAsync(credentials);
      const loginResponse = await loginMutation.mutateAsync({
        username: credentials.username,
        password: credentials.password,
      });
      setAuthState({ status: "authenticated", user: loginResponse.user });
    } catch (error) {
      console.error("Registration or login failed:", error);
    }
  };

  return (
    <AuthPage title="Create account" description="Welcome! Create an account and learn with others!">
      <AuthForm onSubmit={handleRegister} />
    </AuthPage>
  );
}

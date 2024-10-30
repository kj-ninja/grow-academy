import { AuthForm } from "@/features/auth/forms/AuthForm";
import { AuthPage } from "@/components/layout/pages/AuthPage";
import { AuthFormValues } from "@/features/auth/forms/AuthForm.schema";
import { useLoginMutation } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api";

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const { setAuthState } = useAuthState();

  const navigate = useNavigate();

  const handleLogin = async (credentials: AuthFormValues) => {
    const loginResponse = await loginMutation.mutateAsync({
      username: credentials.username,
      password: credentials.password,
    });
    queryClient.setQueryData(
      UserQueries.getCurrentUser().queryKey,
      loginResponse.user,
    );
    setAuthState("authenticated");

    if (loginResponse.user.isActive) {
      navigate("/");
    } else {
      navigate("onboarding");
    }
  };

  return (
    <AuthPage title="Login" description="Welcome back! Login and have fun!">
      <AuthForm onSubmit={handleLogin} />
    </AuthPage>
  );
}

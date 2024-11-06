import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  LoginFormValues,
  LoginFormSchema,
} from "@/features/auth/forms/LoginForm.schema";
import ErrorHandler from "@/services/ErrorHandler";
import { useToast } from "@/hooks/useToast";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api/queryKeys";
import { useLoginMutation } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const { setAuthStatus } = useAuthState();

  const navigate = useNavigate();
  const { toast } = useToast();

  const form = LoginFormSchema.useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const loginResponse = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      });
      queryClient.setQueryData(
        UserQueries.getCurrentUser().queryKey,
        loginResponse.user,
      );
      setAuthStatus("authenticated");

      if (loginResponse.user.isActive) {
        navigate("/");
      } else {
        navigate("onboarding");
      }
    } catch (error) {
      ErrorHandler.handle({
        error,
        form,
        onToast: () =>
          toast({
            title: "Error",
            description: "Something went wrong",
          }),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>Your unique identifier</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />

        <Button type="submit" className="w-full mt-8">
          Submit
        </Button>
      </form>
    </Form>
  );
}

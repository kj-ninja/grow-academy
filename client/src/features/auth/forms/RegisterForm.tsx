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
import ErrorHandler from "@/services/ErrorHandler";
import { useToast } from "@/hooks/useToast";
import { queryClient } from "@/services/ReactQuery";
import { UserQueries } from "@/features/user/api/queryKeys";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/api";
import { useAuthState } from "@/features/auth/stores/authStore";
import {
  RegisterFormSchema,
  RegisterFormValues,
} from "@/features/auth/forms/RegisterForm.schema";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const { setAuthStatus } = useAuthState();

  const { toast } = useToast();

  const form = RegisterFormSchema.useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    const credentials = {
      username: values.username,
      password: values.password,
    };
    try {
      await registerMutation.mutateAsync(credentials);
      const loginResponse = await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      });
      queryClient.setQueryData(UserQueries.getCurrentUser().queryKey, loginResponse.user);
      setAuthStatus("authenticated");
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />

        <Button type="submit" className="mt-8 w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

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
import { AuthFormSchema, AuthFormValues } from "@/features/auth/forms/AuthForm.schema";
import ErrorHandler from "@/services/ErrorHandler";
import { useToast } from "@/hooks/useToast";

interface AuthFormProps {
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

export function AuthForm({ onSubmit }: AuthFormProps) {
  const form = AuthFormSchema.useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { toast } = useToast();

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      await onSubmit(values);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name</FormDescription>
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

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

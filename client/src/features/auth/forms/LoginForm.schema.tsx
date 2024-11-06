import { createFormSchema } from "@/lib/forms";
import * as zod from "zod";

const loginFormSchema = zod.object({
  username: zod.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: zod.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const LoginFormSchema = createFormSchema(loginFormSchema);

export type LoginFormValues = zod.infer<typeof loginFormSchema>;

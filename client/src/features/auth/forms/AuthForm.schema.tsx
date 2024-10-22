import { createFormSchema } from "@/lib/forms";
import * as zod from "zod";

const authFormSchema = zod.object({
  username: zod.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: zod.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const AuthFormSchema = createFormSchema(authFormSchema);

export type AuthFormValues = zod.infer<typeof authFormSchema>;

import { createFormSchema } from "@/lib/forms";
import * as zod from "zod";

const registerFormSchema = zod
  .object({
    username: zod.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: zod.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const RegisterFormSchema = createFormSchema(registerFormSchema);

export type RegisterFormValues = zod.infer<typeof registerFormSchema>;

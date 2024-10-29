import { createFormSchema } from "@/lib/forms";
import * as zod from "zod";

const updateUserFormSchema = zod.object({
  username: zod.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  firstName: zod.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: zod.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  bio: zod.string().optional(),
  avatarImage: zod.union([
    zod.instanceof(File).optional(),
    zod.string().url().optional(),
    zod.literal("").optional(),
    zod.object({ data: zod.array(zod.number()) }).optional(),
    zod.null().optional(),
  ]),
});

export const UpdateUserFormSchema = createFormSchema(updateUserFormSchema);

export type UpdateUserFormValues = zod.infer<typeof updateUserFormSchema>;

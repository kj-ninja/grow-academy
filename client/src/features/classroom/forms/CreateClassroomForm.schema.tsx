import { createFormSchema } from "@/lib/forms";
import * as zod from "zod";

const createClassroomFormSchema = zod.object({
  classroomName: zod
    .string()
    .min(2, { message: "Classroom must be at least 2 characters." }),
  handle: zod
    .string()
    .min(2, { message: "Classroom Handle be at least 2 characters." })
    .regex(/^[A-Za-z0-9_]+$/, {
      message:
        "Classroom Handle must only contain letters, numbers and underscores",
    }),
  description: zod.string().optional(),
  tags: zod.array(zod.string()).optional(),
  accessType: zod.enum(["Private", "Public"]),
  avatarImage: zod.union([
    zod.instanceof(File).optional(),
    zod.string().url().optional(),
    zod.literal("").optional(),
    zod.object({ data: zod.array(zod.number()) }).optional(),
    zod.null().optional(),
  ]),
  backgroundImage: zod.union([
    zod.instanceof(File).optional(),
    zod.string().url().optional(),
    zod.literal("").optional(),
    zod.object({ data: zod.array(zod.number()) }).optional(),
    zod.null().optional(),
  ]),
});

export const CreateClassroomFormSchema = createFormSchema(
  createClassroomFormSchema,
);

export type CreateClassroomFormValues = zod.infer<
  typeof createClassroomFormSchema
>;

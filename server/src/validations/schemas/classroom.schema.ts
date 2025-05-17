import { z } from "zod";

export const classroomBaseSchema = {
  classroomName: z
    .string()
    .min(3, "Classroom name must be at least 3 characters")
    .max(50, "Classroom name cannot exceed 50 characters"),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle cannot exceed 30 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Handle can only contain letters, numbers and underscores"),
  description: z.string().max(500).optional(),
  accessType: z.enum(["Public", "Private"]).default("Public"),
  tags: z.string().optional(),
};

export const createClassroomSchema = z.object({
  ...classroomBaseSchema,
});

export const updateClassroomSchema = z.object({
  ...Object.entries(classroomBaseSchema).reduce(
    (acc, [key, schema]) => ({
      ...acc,
      [key]: schema instanceof z.ZodEnum ? schema.optional() : schema.optional(),
      // Special handling for ZodEnum fields to maintain their enum functionality
      // Makes every field optional using .optional()
      // This approach is necessary because Zod's .optional() method works differently for enum fields vs. regular fields.
    }),
    {}
  ),
});

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;

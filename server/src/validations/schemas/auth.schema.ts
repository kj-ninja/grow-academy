import { z } from "zod";

// Schema that defines what we need from an authenticated user
export const authenticatedUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const registerSchema = loginSchema.extend({
  email: z.string().email(),
});

import { z } from "zod";
import { authenticatedUserSchema } from "../../validations/schemas/auth.schema";

/**
 * Core user entity in the domain
 */
export interface User {
  id: number;
  username: string;
  // password omitted for domain type (implementation detail)
  role: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  // streamToken omitted (implementation detail)
}

/**
 * Available user roles in the system
 */
// todo:
// export enum UserRole {
//   ADMIN = 'admin',
//   INSTRUCTOR = 'instructor',
//   STUDENT = 'student'
// }

/**
 * Represents an authenticated user in the system
 * Contains only the essential information needed after authentication
 */
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

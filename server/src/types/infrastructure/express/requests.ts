import type { Request } from "express";
import type { AuthenticatedUser } from "types/domain/user";
import type { ClassroomUserParams } from "../../domain/classroom";

/**
 * File upload structure from multer
 */
export interface Images {
  avatarImage?: Express.Multer.File[];
  backgroundImage?: Express.Multer.File[];
}

/**
 * Base request extension that adds optional properties to the Express Request
 *
 * This creates a foundation for all other request types to build upon
 */
export interface EnhancedRequest extends Request {
  authenticatedUser?: AuthenticatedUser;
  validatedParams?: Record<string, any>;
  [key: string]: any; // Allow other properties
}

/**
 * Request type that guarantees user authentication
 *
 * Uses intersection type (&) to make the optional authenticatedUser required
 */
export type EnhancedAuthRequest = EnhancedRequest & {
  authenticatedUser: AuthenticatedUser; // Make required
};

/**
 * Request type that guarantees validated parameters
 *
 * Uses intersection type (&) to make the optional validatedParams required
 */
export type RequestWithValidatedParams = EnhancedRequest & {
  validatedParams: Record<string, any>; // Make required
};

/**
 * Combined interface for routes that need both authentication and parameter validation
 *
 * TYPESCRIPT BEHAVIOR: Using interface extension instead of intersection types
 * provides clearer type definitions and better IDE tooltips
 */
export interface AuthenticatedRequestWithParams extends EnhancedRequest {
  authenticatedUser: AuthenticatedUser;
  validatedParams: Record<string, any>;
}

/**
 * Parameter shape for routes that use classroom IDs
 */
export interface ClassroomIdParams {
  id: number;
}

/**
 * Request type specific to classroom routes with ID parameters
 *
 * TYPESCRIPT BEHAVIOR: When extending an interface that already has a property,
 * you can narrow its type to be more specific. This is called "property specialization"
 * and is more explicit than using intersection types.
 *
 * This approach is cleaner than using:
 * AuthenticatedRequestWithParams & { validatedParams: ClassroomIdParams }
 * which would show confusing duplicate properties in IDE tooltips
 */
export interface ClassroomRequest extends AuthenticatedRequestWithParams {
  // This explicitly overrides the parent validatedParams with a more specific type
  validatedParams: ClassroomIdParams;
}

export interface ClassroomUserRequest extends AuthenticatedRequestWithParams {
  validatedParams: ClassroomUserParams;
}

/**
 * Additional specialized request types can follow the same pattern:
 *
 * export interface UserIdParams {
 *   userId: number;
 * }
 *
 * export interface UserRequest extends AuthenticatedRequestWithParams {
 *   validatedParams: UserIdParams;
 * }
 */

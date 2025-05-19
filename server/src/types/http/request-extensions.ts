import type { Request } from "express";
import type { AuthenticatedUser } from "../domain/user";
import type { ClassroomIdParam, ClassroomUserParams } from "./request-params";

declare module "express" {
  interface Request {
    authenticatedUser?: AuthenticatedUser;
    validatedParams?: Record<string, any>;
  }
}

/**
 * File upload structure from multer
 */
export interface Images {
  avatarImage?: Express.Multer.File[];
  backgroundImage?: Express.Multer.File[];
}

/**
 * Base request extension
 */
export interface EnhancedRequest extends Request {
  authenticatedUser?: AuthenticatedUser;
  validatedParams?: Record<string, any>;
}

/**
 * Request with authenticated user
 */
export interface EnhancedAuthRequest extends EnhancedRequest {
  authenticatedUser: AuthenticatedUser;
}

/**
 * Request with validated parameters
 */
export interface RequestWithValidatedParams extends EnhancedRequest {
  validatedParams: Record<string, any>;
}

/**
 * Combined authentication and parameter validation
 */
export interface AuthenticatedRequestWithParams extends EnhancedRequest {
  authenticatedUser: AuthenticatedUser;
  validatedParams: Record<string, any>;
}

/**
 * Classroom-specific requests
 */

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
  validatedParams: ClassroomIdParam;
}

/**
 * Classroom-user operations
 */
export interface ClassroomUserRequest extends AuthenticatedRequestWithParams {
  validatedParams: ClassroomUserParams;
}

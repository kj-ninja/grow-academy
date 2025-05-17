import type { Request } from "express";
import type { AuthenticatedUser } from "types/domain/user";

/**
 * File upload structure from multer
 */
export interface Images {
  avatarImage?: Express.Multer.File[];
  backgroundImage?: Express.Multer.File[];
}

/**
 * Request with enhanced authenticated user
 */
export interface EnhancedAuthRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}

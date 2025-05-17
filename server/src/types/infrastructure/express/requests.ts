import type { Request } from "express";
import type { User } from "@prisma/client";
import type { AuthenticatedUser } from "types/domain/user";

/**
 * File upload structure from multer
 */
export interface Images {
  avatarImage?: Express.Multer.File[];
  backgroundImage?: Express.Multer.File[];
}

/**
 * Request with JWT user
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Request with enhanced authenticated user
 */
export interface EnhancedAuthRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}

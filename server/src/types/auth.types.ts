import type { Request } from "express";
import type { User } from "@prisma/client";
import type { AuthenticatedUser } from "./domain/user";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface EnhancedAuthRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}

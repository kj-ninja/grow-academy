import type { Request } from "express";
import type { AuthenticatedUser } from "./domain/user";

export interface EnhancedAuthRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}

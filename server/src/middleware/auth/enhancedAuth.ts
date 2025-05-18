import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { User } from "@prisma/client";
import { authenticatedUserSchema } from "validations/schemas/auth.schema";
import type { EnhancedAuthRequest } from "../../types/infrastructure/express/requests";
import { errorResponse } from "../../utils/errors";

/**
 * Middleware to authenticate users using JWT strategy
 * and validate the user data with Zod schema.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export const enhancedAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: unknown, user: User | false) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Pick only the fields we need and validate with Zod
      const validatedUser = authenticatedUserSchema.parse({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      // Add the validated user to the request
      (req as EnhancedAuthRequest).authenticatedUser = validatedUser;

      next();
    } catch (_error) {
      return errorResponse(res, "Invalid user data in token", 401);
    }
  })(req, res, next);
};

// Decorator Pattern
/**
 * Higher-order function to wrap route handlers with enhanced authentication
 * and user validation.
 *
 * @param handler - The route handler function
 * @returns A new function that applies enhanced authentication
 */
export const withEnhancedAuth = <ResBody = any, ReqBody = any, ReqQuery = any>(
  handler: (req: EnhancedAuthRequest, res: Response<ResBody>) => Promise<any>
) => {
  return (
    req: Request<any, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    _next: NextFunction
  ) => {
    // authenticatedUser should already exist from enhancedAuth middleware
    return handler(req as unknown as EnhancedAuthRequest, res);
  };
};

export const withEnhancedAuthMiddleware = <ResBody = any, ReqBody = any, ReqQuery = any>(
  middleware: (
    req: EnhancedAuthRequest,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<any>
) => {
  return (
    req: Request<any, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    return middleware(req as EnhancedAuthRequest, res, next);
  };
};

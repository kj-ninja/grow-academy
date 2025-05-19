import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { User } from "@prisma/client";
import { authenticatedUserSchema } from "validations/schemas/auth.schema";
import { errorResponse } from "../../utils/errors";
import type {
  EnhancedAuthRequest,
  EnhancedRequest,
} from "../../types/http/request-extensions";

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
 * TYPESCRIPT GENERICS:
 * - <T extends EnhancedRequest> allows this HOF to work with ANY request type
 *   that extends our base EnhancedRequest interface
 * - This provides flexible type composition in middleware chains
 * - Controllers can specify EXACTLY what properties they need (EnhancedAuthRequest,
 *   ClassroomRequest, etc.) and TypeScript will enforce those requirements
 *
 * TYPE SAFETY BENEFITS:
 * - When a controller specifies req: ClassroomRequest, TypeScript ensures:
 *   1. authenticatedUser is available and properly typed
 *   2. validatedParams.id exists as a number
 * - The double cast (req as unknown as T) bypasses TypeScript's normal
 *   type compatibility checks, allowing middleware to progressively
 *   enhance the request object
 *
 * @param handler - The route handler function with specifically typed request
 * @returns A new function that applies enhanced authentication
 */
export const withEnhancedAuth = <T extends EnhancedRequest, ResBody = any>(
  handler: (req: T, res: Response<ResBody>) => Promise<any>
) => {
  return (req: Request, res: Response<ResBody>, _next: NextFunction) => {
    // authenticatedUser should already exist from enhancedAuth middleware
    return handler(req as unknown as T, res);
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

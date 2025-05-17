import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { User } from "@prisma/client";
import { authenticatedUserSchema } from "validations/schemas/auth.schema";
import { errorResponse } from "utils";
import type { EnhancedAuthRequest } from "types/auth.types";

export const enhancedAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: User | false) => {
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
      } catch (error) {
        return errorResponse(res, "Invalid user data in token", 401);
      }
    },
  )(req, res, next);
};

export const withEnhancedAuth = <ResBody = any, ReqBody = any, ReqQuery = any>(
  handler: (req: EnhancedAuthRequest, res: Response<ResBody>) => Promise<any>,
) => {
  return (
    req: Request<any, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => {
    // authenticatedUser should already exist from enhancedAuth middleware
    return handler(req as unknown as EnhancedAuthRequest, res);
  };
};

export const withEnhancedAuthMiddleware = <
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
>(
  middleware: (
    req: EnhancedAuthRequest,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return (
    req: Request<any, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => {
    return middleware(req as EnhancedAuthRequest, res, next);
  };
};

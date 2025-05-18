import type { Request, Response, NextFunction } from "express";
import { ApplicationError } from "utils/errors";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error for debugging
  console.error(`Debugger [ERROR]: ${err.name}: ${err.message}`, err.stack);

  // Application errors (our custom error classes)
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err.format(),
    });
  }

  // Prisma errors - simplified approach
  if (err.name?.includes("Prisma") && "code" in err) {
    // Handle common Prisma error codes
    const prismaErr = err as any;

    if (prismaErr.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this information already exists",
        details: {
          fields: prismaErr.meta?.target || [],
        },
      });
    }

    if (prismaErr.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Default error response for unhandled errors
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Unknown error occurred",
  });
};

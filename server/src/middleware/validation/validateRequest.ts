import type { Request, Response, NextFunction } from "express";
import { type AnyZodObject, ZodError } from "zod";
import { errorResponse } from "../../utils/errors";

// Factory Pattern
/**
 * Middleware that validates request data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param source - The request property to validate (body, query, params)
 */
// This is a factory function that creates middleware
export const validateRequest =
  (schema: AnyZodObject, source: "body" | "query" | "params" = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request data against the schema
      const validatedData = await schema.parseAsync(req[source]);

      // Replace the request data with the validated data
      req[source] = validatedData;

      // Continue to the next middleware/controller
      return next();
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        return errorResponse(res, "Validation failed", 400, {
          errors: error.format(),
        });
      }

      // Pass other errors to the next error handler
      return next(error);
    }
  };

import { param, validationResult } from "express-validator";
import type { NextFunction, Response } from "express";
import { errorResponse } from "../../utils/errors";
import type { EnhancedRequest } from "../../types/infrastructure/express/requests";

/**
 * Validates multiple route parameters
 *
 * @param params - Array of parameter names to validate
 * @returns Express middleware that validates all specified parameters
 */
export const validateParams = (params: string[]) => {
  return [
    // Create a validator for each parameter
    ...params.map((paramName) =>
      param(paramName)
        .notEmpty()
        .withMessage(`${paramName} is required`)
        .isInt({ min: 1 })
        .withMessage(`${paramName} must be a positive integer`)
        .toInt()
    ),

    // Check validation results and store validated params
    (req: EnhancedRequest, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return errorResponse(res, `Invalid parameter: ${errors.array()[0].msg}`, 400);
      }

      // Initialize validatedParams if needed
      if (!req.validatedParams) {
        req.validatedParams = {};
      }

      // Store each validated parameter
      params.forEach((paramName) => {
        req.validatedParams![paramName] = req.params[paramName];
      });

      next();
    },
  ];
};

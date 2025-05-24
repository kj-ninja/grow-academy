import type { Request, Response } from "express";
import { errorResponse } from "./errors";

/**
 * A higher-order function that wraps a controller function to handle errors.
 * @param controller - The controller function to wrap.
 * @returns A new function that handles errors and calls the original controller.
 */
export function controllerHandler<T extends Request>(
  controller: (req: T, res: Response) => Promise<any>
) {
  return async (req: T, res: Response) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      console.error(`Error in controller: ${error.message}`, error);
      return errorResponse(
        res,
        error.message || "An unexpected error occurred",
        error.statusCode || 500,
        error.details
      );
    }
  };
}

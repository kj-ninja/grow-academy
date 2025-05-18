import type { Request, Response } from "express";
import { errorResponse } from "./errors";

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
        error.statusCode || 500
      );
    }
  };
}

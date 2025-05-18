import type { Response } from "express";

// todo: Add it to the controllers and put here error handling also
export const successResponse = (
  res: Response,
  data: any,
  message = "Operation successful",
  status = 200
) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

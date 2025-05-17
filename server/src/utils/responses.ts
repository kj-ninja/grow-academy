import type { Response } from "express";

export const errorResponse = (
  res: Response,
  message = "An error occurred",
  status = 500,
  details?: any
) => {
  res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

// todo: add it
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

import { PrismaClient } from "@prisma/client";
import type { Response, NextFunction } from "express";
import type { EnhancedAuthRequest } from "types/auth.types";
import { errorResponse } from "utils";

const prisma = new PrismaClient();

export const checkOwner = async (
  req: EnhancedAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id: classroomId } = req.params;
  const userId = req.authenticatedUser.id;

  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: parseInt(classroomId) },
      select: { ownerId: true },
    });

    if (classroom?.ownerId === userId) {
      return next();
    }

    return errorResponse(res, "Access denied", 403);
  } catch (error) {
    return errorResponse(res, "Failed to verify permissions", 500);
  }
};

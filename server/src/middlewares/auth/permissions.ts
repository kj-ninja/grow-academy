import { PrismaClient } from "@prisma/client";
import type { Response, NextFunction } from "express";
import { errorResponse } from "../../utils/errors";
import type { EnhancedAuthRequest } from "../../types/http/request-extensions";

const prisma = new PrismaClient();

export const checkOwner = async (
  req: EnhancedAuthRequest,
  res: Response,
  next: NextFunction
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
  } catch (_error) {
    return errorResponse(res, "Failed to verify permissions", 500);
  }
};

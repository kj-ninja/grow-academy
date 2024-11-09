import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "types/types";

export const generateToken = (userId: number) =>
  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
export const generateRefreshToken = (userId: number) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyToken = (token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret);
    return typeof payload !== "string" && payload.userId ? payload : null;
  } catch {
    return null;
  }
};

const prisma = new PrismaClient();

export const checkOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id: classroomId } = req.params;
  const userId = req.user!.id;

  try {
    // Check if the user is the classroom owner
    const classroom = await prisma.classroom.findUnique({
      where: { id: parseInt(classroomId) },
      select: { ownerId: true },
    });

    if (classroom?.ownerId === userId) {
      return next(); // User is the owner
    }

    // If neither owner nor admin, deny access
    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify permissions" });
  }
};

export const errorResponse = (
  res: Response,
  message = "An error occurred",
  status = 500,
) => {
  res.status(status).json({ message });
};

export const validateHandle = (handle: string) => {
  const isValid = /^[A-Za-z0-9_]+$/.test(handle);
  if (!isValid || handle.length < 2) {
    throw new Error(
      "Handle must be at least 2 characters and only contain letters, numbers, and underscores.",
    );
  }
};

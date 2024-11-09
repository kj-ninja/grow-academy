import type { Request, Response } from "express";
import { PrismaClient, type User } from "@prisma/client";
import type { AuthenticatedRequest, Images } from "types/types";
import { updateStreamUser } from "services/Stream";
import { errorResponse } from "utils";

const prisma = new PrismaClient();

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id: userId } = req.user!;
  const { firstName, lastName, bio } = req.body;

  const files = req.files as Images;

  const avatarImage = files?.avatarImage?.[0];
  const backgroundImage = files?.backgroundImage?.[0];

  const updateData: Pick<
    User,
    "firstName" | "lastName" | "bio" | "avatarImage" | "backgroundImage"
  > & { isActive: boolean } = {
    firstName: firstName || null,
    lastName: lastName || null,
    bio: bio || null,
    avatarImage: avatarImage ? avatarImage.buffer : null,
    backgroundImage: backgroundImage ? backgroundImage.buffer : null,
    isActive: true,
  };

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      omit: { password: true },
    });

    await updateStreamUser(updatedUser);

    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(res, "Failed to update user");
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      omit: { password: true },
      where: { username: req.params.username },
    });

    if (!user) return errorResponse(res, "User not found", 404);

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.user!;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    if (!user) return errorResponse(res, "User not found", 404);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return errorResponse(res, "Failed to fetch current user");
  }
};

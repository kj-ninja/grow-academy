import type { Request, Response } from "express";
import { PrismaClient, type User } from "@prisma/client";
import { updateStreamUser } from "services/infrastructure/StreamChannelService";
import type { EnhancedAuthRequest, Images } from "types/infrastructure/express/requests";
import { errorResponse } from "../utils/errors";

const prisma = new PrismaClient();

export const updateUser = async (req: EnhancedAuthRequest, res: Response) => {
  const userId = req.authenticatedUser.id;
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

    const ownedClassroomCount = await prisma.classroom.count({
      where: { ownerId: user.id },
    });
    const response = {
      ...user,
      ownedClassroomCount,
    };

    return res.status(200).json(response);
  } catch (_error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const getCurrentUser = async (req: EnhancedAuthRequest, res: Response) => {
  const userId = req.authenticatedUser.id;

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

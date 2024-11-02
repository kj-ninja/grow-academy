import type { Request, Response } from "express";
import { PrismaClient, type User } from "@prisma/client";
import streamClient from "@config/streamChat";
import type { AuthenticatedRequest } from "types/types";

const prisma = new PrismaClient();

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id: userId } = req.user!;
  const { firstName, lastName, bio } = req.body;
  const avatarImage = req.file;

  const updateData: Pick<
    User,
    "firstName" | "lastName" | "bio" | "avatarImage"
  > & { isActive: boolean } = {
    firstName: firstName || null,
    lastName: lastName || null,
    bio: bio || null,
    avatarImage: avatarImage ? avatarImage.buffer : null,
    isActive: true,
  };

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      omit: { password: true },
    });

    await streamClient.upsertUsers([
      {
        id: updatedUser.id.toString(),
        name:
          `${updatedUser.firstName} ${updatedUser.lastName}`.trim() || "User",
        bio: updatedUser.bio,
        avatarImage: updatedUser.avatarImage
          ? `data:image/png;base64,${updatedUser.avatarImage.toString("base64")}`
          : null,
      },
    ]);

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      omit: { password: true },
      where: { username: req.params.username },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
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

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch current user" });
  }
};

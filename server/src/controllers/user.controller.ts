import type { Request, Response } from "express";
import { PrismaClient, type User } from "@prisma/client";

type RequestWithUser = Request & { user?: User };

const prisma = new PrismaClient();

export const updateUser = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
      where: { id: req.user.id },
      data: updateData,
      omit: { password: true },
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const getUser = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      omit: { password: true },
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

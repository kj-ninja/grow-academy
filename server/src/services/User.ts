import { PrismaClient, type User } from "@prisma/client";

const prisma = new PrismaClient();

export const updateUserData = async (userId: number, updateData: Partial<User>) => {
  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    omit: { password: true },
  });
};

export const getUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
    omit: { password: true },
  });
};

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
};

import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createDummyUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

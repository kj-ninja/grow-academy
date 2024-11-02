import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import { generateRefreshToken, generateToken, verifyToken } from "utils";
import streamClient from "@config/streamChat";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("username")
    ) {
      return res.status(409).json({
        message: "Username already exists",
        fields: { username: `Username ${username} already exists` },
      });
    }
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        message: "Invalid credentials",
        fields: {
          ...(user
            ? { password: "Invalid password" }
            : { username: `Username ${username} doesn't exist` }),
        },
      });
    }
    // Remove the password field before sending the response
    const { password: _, ...userWithoutPassword } = user;

    const streamToken = streamClient.createToken(user.id.toString());
    // Sync updated user to GetStream
    await streamClient.upsertUsers([
      {
        id: userWithoutPassword.id.toString(),
        username: userWithoutPassword.username,
        name:
          `${userWithoutPassword.firstName} ${userWithoutPassword.lastName}`.trim() ||
          "User",
        role: "user",
      },
    ]);

    res.json({
      user: userWithoutPassword,
      token: generateToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      streamToken,
    });
  } catch {
    res.status(500).json({ message: "Failed to login" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);

  if (!payload) {
    return res.status(403).json({ message: "Invalid Refresh Token" });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json({ token: generateToken(user.id) });
};

export const validateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token, process.env.JWT_SECRET!);

  if (!payload) return res.status(403).json({ message: "Invalid Token" });

  const user = await prisma.user.findUnique({
    omit: { password: true },
    where: { id: payload.userId },
  });

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json(user);
};

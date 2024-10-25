import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2022: Unique constraint failed
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      if (error.code === "P2002" && Array.isArray(error.meta?.target) && error.meta.target.includes("username")) {
        return res.status(409).json({
          message: `Username already exists`,
          fields: {
            username: `Username ${username} already exists`,
          },
        });
      }
    }
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log("Login failed: User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Login failed: Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    res.json({ token, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

    if (typeof payload === "string" || !payload.userId) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const newToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid Refresh Token" });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof payload === "string" || !payload.userId) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Return user information
    res.json({ user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

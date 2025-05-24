import { type Request, type Response } from "express";
import { AuthService } from "../services/application/AuthService";
import { controllerHandler } from "../utils/controllerHandler";
import type { AuthRequest } from "../types/http/request-extensions";

const authService = new AuthService();

/**
 * Registration request data
 */
// export interface RegisterRequest {
//   username: string;
//   password: string;
// }

/**
 * Login request data
 */
// export interface LoginRequest {
//   username: string;
//   password: string;
// }

/**
 * Token refresh request
 */
// export interface RefreshTokenRequest {
//   refreshToken: string;
// }

// export interface LoginResponse {
//   user: {
//     id: number;
//     username: string;
//     role: string;
//     createdAt: Date;
//     updatedAt: Date;
//     firstName: string | null;
//     lastName: string | null;
//     bio: string | null;
//     avatarImage: Buffer | null;
//     backgroundImage: Buffer | null;
//     isActive: boolean;
//     streamToken: string;
//   };
//   token: string;
//   refreshToken: string;
//   streamToken: string;
// }

/**
 * Registration response
 */
// export interface RegisterResponse {
//   message: string;
// }

/**
 * Token refresh response
 */
// export interface RefreshTokenResponse {
//   token: string;
// }

export const registerUser = controllerHandler(async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;
  const result = await authService.registerUser(username, password);
  return res.status(201).json(result);
});

export const loginUser = controllerHandler(async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;
  const result = await authService.loginUser(username, password);
  return res.status(200).json(result);
});

// todo: add typed requests
export const refreshToken = controllerHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAuthToken(refreshToken);
  return res.status(200).json(result);
});

export const validateToken = controllerHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const user = await authService.validateAuthToken(token);

  return res.status(200).json(user);
});

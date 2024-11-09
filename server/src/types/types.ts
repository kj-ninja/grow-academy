import type { Request } from "express";
import type { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface Images {
  avatarImage?: Express.Multer.File[];
  backgroundImage?: Express.Multer.File[];
}

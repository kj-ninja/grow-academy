import passport from "passport";
import { type User } from "@prisma/client";
import { type RequestHandler } from "express";

export const authenticateJWT: RequestHandler = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: User | false) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

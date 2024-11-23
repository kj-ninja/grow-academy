import express from "express";
import {
  getCurrentUser,
  getUser,
  updateUser,
} from "@controllers/user.controller";
import { uploadMultiple } from "middlewares/uploadMiddleware";
import { authenticateJWT } from "middlewares/authenticateJWT";

const router = express.Router();

router.get("/me", authenticateJWT, getCurrentUser);
router.patch("/update", authenticateJWT, uploadMultiple, updateUser);

router.get("/profile/:username", authenticateJWT, getUser);

export default router;

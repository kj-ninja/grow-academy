import express from "express";
import {
  getCurrentUser,
  getUser,
  updateUser,
} from "@controllers/user.controller";
import { uploadMultiple } from "@middleware/uploadMiddleware";
import { authenticateJWT } from "@middleware/authenticateJWT";

const router = express.Router();

router.get("/me", authenticateJWT, getCurrentUser);
router.patch("/update", authenticateJWT, uploadMultiple, updateUser);

router.get("/profile/:username", authenticateJWT, getUser);

export default router;

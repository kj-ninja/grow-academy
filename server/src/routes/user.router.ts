import express from "express";
import { getUser, updateUser } from "@controllers/user.controller";
import { upload } from "@middleware/uploadMiddleware";
import { authenticateJWT } from "@middleware/authenticateJWT";

const router = express.Router();

router.put(
  "/update/:id",
  authenticateJWT,
  upload.single("avatarImage"),
  updateUser,
);

router.get("/profile/:username", authenticateJWT, getUser);

export default router;

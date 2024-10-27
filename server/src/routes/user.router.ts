import express from "express";
import { updateUser } from "@controllers/auth.controller";
import { upload } from "@middleware/uploadMiddleware";
import { authenticateJWT } from "@middleware/authenticateJWT";

const router = express.Router();

router.put(
  "/update/:id",
  authenticateJWT,
  upload.single("avatarImage"),
  updateUser,
);

export default router;

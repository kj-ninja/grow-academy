import express from "express";
import { getCurrentUser, getUser, updateUser } from "controllers/user.controller";
import { uploadMultiple } from "middleware/upload/uploadMiddleware";
import { withAuth } from "../middleware/domain/classroom.middleware";
import { withEnhancedAuth } from "middleware/auth/enhancedAuth";

const router = express.Router();

router.get("/me", withAuth, withEnhancedAuth(getCurrentUser));
router.patch("/update", withAuth, uploadMultiple, withEnhancedAuth(updateUser));
router.get("/profile/:username", withAuth, getUser);

export default router;

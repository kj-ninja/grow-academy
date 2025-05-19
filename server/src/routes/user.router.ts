import express from "express";
import { getCurrentUser, getUser, updateUser } from "controllers/user.controller";
import { uploadMultiple } from "middlewares/upload/uploadMiddleware";
import { withAuth } from "../middlewares/domain/classroom";
import { withEnhancedAuth } from "middlewares/auth/enhancedAuth";

const router = express.Router();

router.get("/me", withAuth, withEnhancedAuth(getCurrentUser));
router.patch("/update", withAuth, uploadMultiple, withEnhancedAuth(updateUser));
router.get("/profile/:username", withAuth, getUser);

export default router;

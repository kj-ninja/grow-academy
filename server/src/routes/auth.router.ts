import { Router } from "express";
import {
  loginUser,
  refreshToken,
  registerUser,
  validateToken,
} from "@controllers/auth.controller";
import { loginLimiter } from "@middleware/rateLimiter";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/refresh", refreshToken);
router.get("/validate", validateToken);

export default router;

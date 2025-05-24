import { Router } from "express";
import { validateToken } from "../controllers/auth.controller";
import {
  handleRegister,
  handleLogin,
  handleRefreshToken,
} from "../middlewares/domain/auth";

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/refresh", handleRefreshToken);
router.get("/validate", validateToken);

export default router;

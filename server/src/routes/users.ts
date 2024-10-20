import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.get("/", authenticateJWT, getUsers);

export default router;

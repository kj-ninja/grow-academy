import { Router } from "express";
import { getUsers, createDummyUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);

router.post("/dummy", createDummyUser);

export default router;

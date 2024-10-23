import { Router } from "express";
import { loginUser, refreshToken, registerUser, validateToken } from "@controllers/auth.controller";
import passport from "passport";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.get("/auth/validate", passport.authenticate("jwt", { session: false }), validateToken);
router.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ message: "You have access!" });
});

export default router;

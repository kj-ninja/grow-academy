import { registerUser, loginUser, refreshToken } from "../../controllers/auth.controller";
import { registerSchema, loginSchema, refreshTokenSchema } from "../../validations";
import { loginLimiter } from "../auth/rateLimiter";
import { compose } from "../composition/compose";
import { validateRequest } from "../validation/validateRequest";

export const handleRegister = compose(validateRequest(registerSchema), registerUser);

export const handleLogin = compose(loginLimiter, validateRequest(loginSchema), loginUser);

export const handleRefreshToken = compose(
  validateRequest(refreshTokenSchema),
  refreshToken
);

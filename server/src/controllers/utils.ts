import jwt from "jsonwebtoken";

export const generateToken = (userId: number) =>
  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
export const generateRefreshToken = (userId: number) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyToken = (token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret);
    return typeof payload !== "string" && payload.userId ? payload : null;
  } catch {
    return null;
  }
};

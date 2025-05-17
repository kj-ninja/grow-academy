import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  handler: (req, res) => {
    res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
  },
});

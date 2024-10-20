import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/users.ts";
import { errorHandler } from "@middleware/errorHandler";
import path from "path";
import passport from "passport";
import authRouter from "./routes/auth.router";
import "./config/passportConfig";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust if your frontend is hosted on another port
  })
);

// Middlewares
app.use(express.json());
app.use(morgan("dev")); // Logging middleware for monitoring requests

app.use("/api/users", userRouter);
app.use("/auth", authRouter);

// Serve static files from public (correct the path)
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

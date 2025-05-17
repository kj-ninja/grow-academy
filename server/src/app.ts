import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "middlewares/error/errorHandler";
import path from "path";
import passport from "passport";
import authRouter from "@routes/auth.router";
import userRouter from "@routes/user.router";
import "@config/passportConfig";
import classroomRouter from "@routes/classroom.router";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/classroom", classroomRouter);

// Serve static files from public
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.use(errorHandler);

export default app;

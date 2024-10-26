import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "@middleware/errorHandler";
import path from "path";
import passport from "passport";
import authRouter from "@routes/auth.router";
import "@config/passportConfig";

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

// Serve static files from public
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.use(errorHandler);

export default app;

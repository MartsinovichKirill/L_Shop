import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { login, logout, me, register } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const usersRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

usersRouter.post("/register", authLimiter, register);
usersRouter.post("/login", authLimiter, login);
usersRouter.post("/logout", requireAuth, logout);
usersRouter.get("/me", requireAuth, me);

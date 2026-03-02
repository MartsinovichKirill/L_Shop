import { Router } from "express";
import { login, logout, me, register } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const usersRouter = Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", requireAuth, logout);
usersRouter.get("/me", requireAuth, me);

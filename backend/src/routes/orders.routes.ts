import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listOrders } from "../controllers/orders.controller.js";

export const ordersRouter = Router();
ordersRouter.get("/", requireAuth, listOrders);

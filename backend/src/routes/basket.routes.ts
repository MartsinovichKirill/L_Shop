import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { addToBasket, checkout, getBasket, removeItem, updateQty } from "../controllers/basket.controller.js";

export const basketRouter = Router();

basketRouter.get("/", requireAuth, getBasket);
basketRouter.post("/add", requireAuth, addToBasket);
basketRouter.post("/update", requireAuth, updateQty);
basketRouter.post("/remove", requireAuth, removeItem);
basketRouter.post("/checkout", requireAuth, checkout);

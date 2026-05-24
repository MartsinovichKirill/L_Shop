import { Router } from "express";
import { listProducts } from "../controllers/products.controller.js";

export const productsRouter = Router();
productsRouter.get("/", listProducts);

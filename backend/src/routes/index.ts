import { Router } from "express";
import { usersRouter } from "./users.routes.js";
import { productsRouter } from "./products.routes.js";
import { basketRouter } from "./basket.routes.js";
import { ordersRouter } from "./orders.routes.js";

export const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/basket", basketRouter);
apiRouter.use("/orders", ordersRouter);

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { env } from "./env.js";
import { errorHandler, notFound } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONT_ORIGIN,
      credentials: true
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

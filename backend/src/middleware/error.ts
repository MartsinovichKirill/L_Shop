import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export { AppError };

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.error("[Error]", err);
  res.status(500).json({ message: "Internal server error" });
}

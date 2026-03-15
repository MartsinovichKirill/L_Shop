import type { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const msg = err instanceof Error ? err.message : "Server error";
  res.status(400).json({ message: msg });
}

import type { Request, Response, NextFunction } from "express";
import { env } from "../env.js";
import { sessionsStore } from "../storage/initData.js";

function isExpired(expiresAtIso: string): boolean {
  return Date.parse(expiresAtIso) <= Date.now();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const sid = req.cookies?.[env.COOKIE_NAME] as unknown;
  if (typeof sid !== "string" || sid.length === 0) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const sessions = await sessionsStore.read();
  const alive = sessions.filter((s) => !isExpired(s.expiresAt));
  if (alive.length !== sessions.length) await sessionsStore.write(alive);

  const session = alive.find((s) => s.id === sid);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.userId = session.userId;
  next();
}

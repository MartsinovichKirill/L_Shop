import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { env } from "../env.js";
import { usersStore, sessionsStore } from "../storage/initData.js";
import { addMsToIso, newId, nowIso } from "../utils/ids.js";
import { isRecord, mustString, optString } from "../utils/validate.js";
import { AppError } from "../utils/errors.js";
import type { Session, User } from "../types/domain.js";

function setSessionCookie(res: Response, sessionId: string): void {
  res.cookie(env.COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.IS_PROD,
    maxAge: env.SESSION_TTL_MS
  });
}

function userPublic(u: User): Omit<User, "passwordHash"> {
  const { passwordHash: _ph, ...rest } = u;
  return rest;
}

export async function register(req: Request, res: Response): Promise<void> {
  if (!isRecord(req.body)) throw new AppError("Invalid body");

  const name = mustString(req.body.name, "name");
  const password = mustString(req.body.password, "password");
  if (password.length < 6) throw new AppError('Field "password" must be at least 6 characters');

  const email = optString(req.body.email);
  const login = optString(req.body.login);
  const phone = optString(req.body.phone);

  if (!email && !login && !phone) {
    throw new AppError('Provide at least one of: "email", "login", "phone"');
  }

  const users = await usersStore.read();

  const exists = users.some(
    (u) => (email && u.email === email) || (login && u.login === login) || (phone && u.phone === phone)
  );
  if (exists) throw new AppError("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    id: newId(),
    name,
    email,
    login,
    phone,
    passwordHash,
    createdAt: nowIso()
  };

  users.push(user);
  await usersStore.write(users);

  const session: Session = {
    id: newId(),
    userId: user.id,
    createdAt: nowIso(),
    expiresAt: addMsToIso(env.SESSION_TTL_MS)
  };

  const sessions = await sessionsStore.read();
  sessions.push(session);
  await sessionsStore.write(sessions);

  setSessionCookie(res, session.id);
  res.status(201).json({ user: userPublic(user) });
}

export async function login(req: Request, res: Response): Promise<void> {
  if (!isRecord(req.body)) throw new AppError("Invalid body");

  const password = mustString(req.body.password, "password");
  const email = optString(req.body.email);
  const loginV = optString(req.body.login);
  const phone = optString(req.body.phone);

  if (!email && !loginV && !phone) {
    throw new AppError('Provide at least one of: "email", "login", "phone"');
  }

  const users = await usersStore.read();

  const user =
    (email ? users.find((u) => u.email === email) : undefined) ??
    (loginV ? users.find((u) => u.login === loginV) : undefined) ??
    (phone ? users.find((u) => u.phone === phone) : undefined);

  if (!user) throw new AppError("Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials");

  const session: Session = {
    id: newId(),
    userId: user.id,
    createdAt: nowIso(),
    expiresAt: addMsToIso(env.SESSION_TTL_MS)
  };

  const sessions = await sessionsStore.read();
  sessions.push(session);
  await sessionsStore.write(sessions);

  setSessionCookie(res, session.id);
  res.json({ user: userPublic(user) });
}

export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const users = await usersStore.read();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({ user: userPublic(user) });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const sid = req.cookies?.[env.COOKIE_NAME] as unknown;

  if (typeof sid === "string" && sid.length) {
    const sessions = await sessionsStore.read();
    const next = sessions.filter((s) => s.id !== sid);
    if (next.length !== sessions.length) await sessionsStore.write(next);
  }

  res.clearCookie(env.COOKIE_NAME, { httpOnly: true, sameSite: "lax" });
  res.json({ ok: true });
}

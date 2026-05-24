const rawTtl = Number(process.env.SESSION_TTL_MS ?? "");
const SESSION_TTL_MS = Number.isFinite(rawTtl) && rawTtl > 0 ? rawTtl : 10 * 60 * 1000;

export const env = {
  PORT: Number(process.env.PORT ?? "3001"),
  FRONT_ORIGIN: process.env.FRONT_ORIGIN ?? "http://localhost:5173",
  COOKIE_NAME: "sid",
  SESSION_TTL_MS,
  IS_PROD: (process.env.NODE_ENV ?? "development") === "production"
};

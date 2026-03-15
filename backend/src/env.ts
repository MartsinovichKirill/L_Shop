export const env = {
  PORT: Number(process.env.PORT ?? "3001"),
  FRONT_ORIGIN: process.env.FRONT_ORIGIN ?? "http://localhost:5173",
  COOKIE_NAME: "sid",
  SESSION_TTL_MS: 10 * 60 * 1000
};

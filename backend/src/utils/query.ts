export function qString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export function qBool(v: unknown): boolean | undefined {
  if (typeof v !== "string") return undefined;
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
}

export function qStringArray(v: unknown): string[] | undefined {
  if (typeof v === "string") return [v];
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v.slice();
  return undefined;
}

export function qInt(v: unknown, min: number, max: number): number | undefined {
  const n = Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) return undefined;
  return n;
}

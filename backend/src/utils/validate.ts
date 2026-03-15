export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function mustString(v: unknown, field: string): string {
  if (typeof v !== "string" || v.trim().length === 0) {
    throw new Error(`Field "${field}" must be a non-empty string`);
  }
  return v.trim();
}

export function optString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export function mustInt(v: unknown, field: string, min: number, max: number): number {
  if (typeof v !== "number" || !Number.isInteger(v) || v < min || v > max) {
    throw new Error(`Field "${field}" must be int in [${min}, ${max}]`);
  }
  return v;
}

export function mustOneOf<T extends string>(v: unknown, field: string, allowed: readonly T[]): T {
  if (typeof v !== "string") throw new Error(`Field "${field}" must be string`);
  if (!allowed.includes(v as T)) throw new Error(`Field "${field}" invalid value`);
  return v as T;
}

import { promises as fs } from "node:fs";
import path from "node:path";

type Json = unknown;

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function ensureFile(filePath: string, initial: Json): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

export class JsonStore<T> {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async ensure(initial: T): Promise<void> {
    await ensureDir(path.dirname(this.filePath));
    await ensureFile(this.filePath, initial);
  }

  async read(): Promise<T> {
    const raw = await fs.readFile(this.filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  }

  async write(data: T): Promise<void> {
    const dir = path.dirname(this.filePath);
    await ensureDir(dir);

    const tmp = `${this.filePath}.tmp`;
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(tmp, json, "utf8");
    await fs.rename(tmp, this.filePath);
  }
}

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { createSeed } from "./seed";
import type { DB } from "./types";

// Vercel's filesystem is read-only except /tmp, which is wiped often: good enough for a demo,
// but orders and admin edits won't last there. A real store needs a Node host with a disk.
export const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "vestro-data") : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return { ...createSeed(), ...JSON.parse(raw) } as DB;
  } catch {
    const seed = createSeed();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
}

export async function readDB(): Promise<DB> {
  await queue;
  return load();
}

/** Serialised read-modify-write so concurrent requests never clobber each other. */
export function mutateDB<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    const tmp = `${DB_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, DB_FILE);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

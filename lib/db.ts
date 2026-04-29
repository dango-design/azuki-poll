import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

function buildClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    return createClient({ url, authToken });
  }

  // Local fallback: file-backed SQLite at ./data/poll.db
  const filePath = join(process.cwd(), "data", "poll.db");
  mkdirSync(dirname(filePath), { recursive: true });
  return createClient({ url: `file:${filePath}` });
}

const globalForDb = globalThis as unknown as {
  __db?: Client;
  __dbReady?: Promise<void>;
};

export const db: Client = globalForDb.__db ?? buildClient();

async function migrate(): Promise<void> {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        respondent_name TEXT,
        picks TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )`,
    ],
    "write",
  );
}

export const dbReady: Promise<void> =
  globalForDb.__dbReady ?? migrate();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__db = db;
  globalForDb.__dbReady = dbReady;
}

export type Vote = {
  id: number;
  respondent_name: string | null;
  picks: string;
  created_at: number;
};

import { db, dbReady } from "../lib/db";
import { nanoid } from "nanoid";

/**
 *   npx tsx scripts/seed.ts "Sarah" sarah@example.com
 *   npx tsx scripts/seed.ts "Sarah"
 *   npx tsx scripts/seed.ts            # list all recipients
 *   cat recipients.csv | npx tsx scripts/seed.ts --stdin
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

async function add(name: string | null, email: string | null) {
  const token = nanoid(10);
  await db.execute({
    sql: "INSERT INTO recipients (token, name, email) VALUES (?, ?, ?)",
    args: [token, name, email],
  });
  console.log(`${name ?? "(no name)"}\t${BASE_URL}/p/${token}`);
}

async function list() {
  const result = await db.execute(
    "SELECT r.name, r.email, r.token, (SELECT 1 FROM responses WHERE token = r.token) AS responded FROM recipients r ORDER BY r.created_at DESC",
  );
  const rows = result.rows as unknown as {
    name: string | null;
    email: string | null;
    token: string;
    responded: number | null;
  }[];
  if (rows.length === 0) {
    console.log("No recipients yet. Add one: npx tsx scripts/seed.ts \"Name\" email@example.com");
    return;
  }
  for (const r of rows) {
    const status = r.responded ? "✓" : " ";
    console.log(
      `${status} ${(r.name ?? "(no name)").padEnd(24)} ${(r.email ?? "").padEnd(30)} ${BASE_URL}/p/${r.token}`,
    );
  }
}

async function main() {
  await dbReady;
  const args = process.argv.slice(2);

  if (args[0] === "--stdin") {
    const buf = await new Promise<string>((resolve) => {
      let data = "";
      process.stdin.on("data", (c) => (data += c));
      process.stdin.on("end", () => resolve(data));
    });
    for (const line of buf.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [name, email] = trimmed.split(",").map((s) => s.trim());
      await add(name || null, email || null);
    }
  } else if (args.length === 0) {
    await list();
  } else {
    const [name, email] = args;
    await add(name || null, email || null);
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);

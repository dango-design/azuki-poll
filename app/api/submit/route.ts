import { db, dbReady, type Recipient } from "@/lib/db";
import { OPTIONS_BY_ID } from "@/lib/options";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token, picks, name } = body as {
    token?: unknown;
    picks?: unknown;
    name?: unknown;
  };

  if (typeof token !== "string" || token.length === 0) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }
  if (
    !Array.isArray(picks) ||
    picks.length === 0 ||
    picks.length > 3 ||
    !picks.every((p) => typeof p === "string" && OPTIONS_BY_ID.has(p))
  ) {
    return Response.json({ error: "Invalid picks" }, { status: 400 });
  }
  if (new Set(picks).size !== picks.length) {
    return Response.json({ error: "Duplicate picks" }, { status: 400 });
  }
  if (name !== null && (typeof name !== "string" || name.length > 60)) {
    return Response.json({ error: "Invalid name" }, { status: 400 });
  }

  await dbReady;

  const recipientResult = await db.execute({
    sql: "SELECT * FROM recipients WHERE token = ?",
    args: [token],
  });
  const recipient = recipientResult.rows[0] as unknown as Recipient | undefined;
  if (!recipient) {
    return Response.json({ error: "Unknown token" }, { status: 404 });
  }

  await db.execute({
    sql: `INSERT INTO responses (token, respondent_name, picks)
          VALUES (?, ?, ?)
          ON CONFLICT(token) DO UPDATE SET
            respondent_name = excluded.respondent_name,
            picks = excluded.picks,
            created_at = unixepoch()`,
    args: [token, name as string | null, JSON.stringify(picks)],
  });

  return Response.json({ ok: true });
}

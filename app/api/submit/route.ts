import { db, dbReady } from "@/lib/db";
import { OPTIONS_BY_ID } from "@/lib/options";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { picks, name } = body as {
    picks?: unknown;
    name?: unknown;
  };

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

  await db.execute({
    sql: `INSERT INTO votes (respondent_name, picks) VALUES (?, ?)`,
    args: [name as string | null, JSON.stringify(picks)],
  });

  return Response.json({ ok: true });
}

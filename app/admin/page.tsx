import { isAdmin } from "@/lib/auth";
import { db, dbReady, type Recipient, type Response } from "@/lib/db";
import { POLL_OPTIONS } from "@/lib/options";
import LoginForm from "./LoginForm";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

type Row = {
  recipient: Recipient;
  response: Response | null;
};

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <div className="admin-page">
        <Header />
        <LoginForm />
      </div>
    );
  }

  await dbReady;

  const recipientsResult = await db.execute(
    "SELECT * FROM recipients ORDER BY created_at DESC",
  );
  const recipients: Recipient[] = recipientsResult.rows.map((r) => ({
    id: Number(r.id),
    token: String(r.token),
    name: r.name === null ? null : String(r.name),
    email: r.email === null ? null : String(r.email),
    created_at: Number(r.created_at),
  }));

  const responsesResult = await db.execute("SELECT * FROM responses");
  const responses: Response[] = responsesResult.rows.map((r) => ({
    id: Number(r.id),
    token: String(r.token),
    respondent_name: r.respondent_name === null ? null : String(r.respondent_name),
    picks: String(r.picks),
    created_at: Number(r.created_at),
  }));
  const byToken = new Map(responses.map((r) => [r.token, r]));

  const rows: Row[] = recipients.map((r) => ({
    recipient: r,
    response: byToken.get(r.token) ?? null,
  }));

  const tally = new Map<string, number>();
  for (const r of responses) {
    const picks = JSON.parse(r.picks) as string[];
    picks.forEach((id, i) => {
      const weight = 3 - i;
      tally.set(id, (tally.get(id) ?? 0) + weight);
    });
  }
  const ranked = POLL_OPTIONS.map((o) => ({
    ...o,
    score: tally.get(o.id) ?? 0,
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="admin-page">
      <Header />
      <AdminClient
        rows={rows.map((r) => ({
          ...r,
          response: r.response
            ? {
                ...r.response,
                picksParsed: JSON.parse(r.response.picks) as string[],
              }
            : null,
        }))}
        ranked={ranked}
        options={POLL_OPTIONS}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="poll-header">
      <div className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-logo" src="/azuki-baby-logo.png" alt="Azuki Baby" />
        <span>Azuki Baby — admin</span>
      </div>
    </div>
  );
}

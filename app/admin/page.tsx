import { isAdmin } from "@/lib/auth";
import { db, dbReady, type Vote } from "@/lib/db";
import { POLL_OPTIONS } from "@/lib/options";
import LoginForm from "./LoginForm";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

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

  const votesResult = await db.execute(
    "SELECT * FROM votes ORDER BY created_at DESC",
  );
  const votes: Vote[] = votesResult.rows.map((r) => ({
    id: Number(r.id),
    respondent_name: r.respondent_name === null ? null : String(r.respondent_name),
    picks: String(r.picks),
    created_at: Number(r.created_at),
  }));

  const tally = new Map<string, number>();
  for (const v of votes) {
    const picks = JSON.parse(v.picks) as string[];
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
        votes={votes.map((v) => ({
          ...v,
          picksParsed: JSON.parse(v.picks) as string[],
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

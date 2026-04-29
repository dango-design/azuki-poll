"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Vote } from "@/lib/db";
import type { PollOption } from "@/lib/options";

type VoteRow = Vote & { picksParsed: string[] };

type RankedOption = PollOption & { score: number };

export default function AdminClient({
  votes,
  ranked,
  options,
}: {
  votes: VoteRow[];
  ranked: RankedOption[];
  options: PollOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const optionsById = new Map(options.map((o) => [o.id, o]));

  async function deleteVote(id: number) {
    if (!confirm("Delete this vote?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/votes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete");
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "baseline" }}>
        <h1 className="question" style={{ fontSize: 28, margin: 0 }}>
          Results
        </h1>
        <p className="subtitle" style={{ margin: 0 }}>
          {votes.length} {votes.length === 1 ? "vote" : "votes"}
        </p>
      </div>

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 16px" }}>
          Standings (1st = 3 pts, 2nd = 2, 3rd = 1)
        </h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {ranked.map((opt, i) => (
            <li
              key={opt.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: 18,
                  fontWeight: 600,
                  width: 28,
                  color: i < 3 ? "var(--text)" : "var(--muted)",
                }}
              >
                {i + 1}
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundImage: `url(${opt.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontWeight: 500 }}>{opt.name}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--muted)", fontSize: 13 }}>
                {opt.score} pts
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Voted as</th>
              <th>Picks</th>
              <th>When</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {votes.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ color: "var(--muted)", textAlign: "center", padding: "24px 0" }}>
                  No votes yet.
                </td>
              </tr>
            ) : (
              votes.map((vote) => (
                <tr key={vote.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {vote.respondent_name ?? <span style={{ color: "var(--muted)" }}>(no name)</span>}
                    </div>
                  </td>
                  <td>
                    <div>
                      {vote.picksParsed.map((id, i) => {
                        const opt = optionsById.get(id);
                        if (!opt) return null;
                        return (
                          <span key={id} className="pick-mini">
                            <span
                              className="pick-mini-thumb"
                              style={{ backgroundImage: `url(${opt.image})` }}
                            />
                            <span className="pick-mini-rank">#{i + 1}</span>
                            {opt.name}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                    {new Date(vote.created_at * 1000).toLocaleString()}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger"
                      disabled={deletingId === vote.id || pending}
                      onClick={() => deleteVote(vote.id)}
                    >
                      {deletingId === vote.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

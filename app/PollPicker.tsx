"use client";

import { useMemo, useState } from "react";
import type { PollOption } from "@/lib/options";

const SUFFIX: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

type Props = {
  options: PollOption[];
};

export default function PollPicker({ options }: Props) {
  const [picks, setPicks] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const optionsById = useMemo(
    () => new Map(options.map((o) => [o.id, o])),
    [options],
  );

  function toggle(id: string) {
    setPicks((prev) => {
      const i = prev.indexOf(id);
      if (i >= 0) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function removeRank(rank: number) {
    setPicks((prev) => prev.filter((_, i) => i !== rank - 1));
  }

  async function submit() {
    if (picks.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks, name: name.trim() || null }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submit failed");
      }
      setSubmittedName(name.trim() || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedName !== null) {
    return (
      <ThanksScreen
        name={submittedName}
        picks={picks.map((id) => optionsById.get(id)!).filter(Boolean)}
      />
    );
  }

  return (
    <div className="poll-page">
      <div className="poll-header">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/azuki-baby-logo.png" alt="Azuki Baby" />
          <span>Azuki Baby</span>
        </div>
        <div className="progress">{picks.length} of 3 picked</div>
      </div>

      <div className="intro">
        <h1 className="question">Pick your top 3 favorites.</h1>
        <p className="subtitle">
          Tap to rank. First tap is #1, then #2, then #3. Tap again to remove.
        </p>
      </div>

      <div className="grid-cards">
        {options.map((opt) => {
          const rank = picks.indexOf(opt.id) + 1;
          const isSelected = rank > 0;
          return (
            <button
              key={opt.id}
              type="button"
              className={`card${isSelected ? " is-selected" : ""}`}
              data-rank={isSelected ? rank : undefined}
              onClick={() => toggle(opt.id)}
            >
              <div
                className="card-image"
                style={{ backgroundImage: `url(${opt.image})` }}
              >
                {isSelected && (
                  <div className="rank-badge">
                    <span className="rank-num">{rank}</span>
                    <span className="rank-suffix">{SUFFIX[rank]}</span>
                  </div>
                )}
              </div>
              <div className="card-body">
                <h3 className="card-title">{opt.name}</h3>
                <p className="card-meta">{opt.meta}</p>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p style={{ color: "var(--accent)", marginTop: 16, fontSize: 14 }}>
          {error}
        </p>
      )}

      <div className="tray-wrap">
        <div className="tray">
          <div className="tray-slots">
            {[1, 2, 3].map((rank) => {
              const id = picks[rank - 1];
              const opt = id ? optionsById.get(id) : undefined;
              const filled = Boolean(opt);
              return (
                <div
                  key={rank}
                  className={`slot${filled ? " is-filled" : ""}`}
                  data-rank={rank}
                >
                  <div
                    className="slot-thumb"
                    style={
                      opt
                        ? { backgroundImage: `url(${opt.image})` }
                        : undefined
                    }
                  >
                    {!opt && <span className="slot-empty-num">{rank}</span>}
                  </div>
                  <div className="slot-name">
                    {opt
                      ? opt.name
                      : ["First choice", "Second choice", "Third choice"][
                          rank - 1
                        ]}
                  </div>
                  <button
                    type="button"
                    className="slot-remove"
                    aria-label="Remove"
                    onClick={() => removeRank(rank)}
                  >
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="tray-actions">
            <input
              id="name-input"
              type="text"
              className="name-input"
              placeholder="Your name"
              autoComplete="given-name"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={picks.length === 0 || submitting}
              onClick={submit}
            >
              {submitting ? "Submitting…" : "Submit"}
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10m0 0L9 4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThanksScreen({
  name,
  picks,
}: {
  name: string | null;
  picks: PollOption[];
}) {
  const heading = name && name.length > 0 ? `Thanks, ${name}.` : "Thanks for voting.";
  return (
    <div className="poll-page">
      <div className="poll-header">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/azuki-baby-logo.png" alt="Azuki Baby" />
          <span>Azuki Baby</span>
        </div>
      </div>
      <div className="thanks">
        <div className="thanks-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l5 5L20 7"
              stroke="#1c1917"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>{heading}</h2>
        <p>Your picks have been recorded. We&rsquo;ll let you know what wins.</p>
        <div className="thanks-picks">
          {picks.map((opt, i) => (
            <div key={opt.id} className="thanks-pick">
              <div
                className="thanks-pick-thumb"
                style={{ backgroundImage: `url(${opt.image})` }}
              >
                <div className="thanks-pick-rank">#{i + 1}</div>
              </div>
              <div className="thanks-pick-name">{opt.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

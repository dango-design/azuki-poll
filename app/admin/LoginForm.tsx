"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-card" style={{ maxWidth: 380, margin: "60px auto 0" }}>
      <h1 className="question" style={{ fontSize: 24, marginBottom: 6 }}>
        Admin
      </h1>
      <p className="subtitle" style={{ marginBottom: 24 }}>
        Enter the password to view results.
      </p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="password"
          className="name-input"
          placeholder="Password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p style={{ color: "var(--accent)", fontSize: 13, margin: 0 }}>{error}</p>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || password.length === 0}
          style={{ justifyContent: "center" }}
        >
          {loading ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

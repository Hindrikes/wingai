"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccessForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("from") ?? "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirect);
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wing-50 via-white to-wing-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🦋</div>
        <h1 className="text-xl font-semibold text-wing-900 mb-1">WingAI</h1>
        <p className="text-sm text-muted-foreground mb-8">Privat beta — ange lösenord för att fortsätta</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-wing-100 shadow-sm p-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            autoFocus
            className="w-full px-3 py-2.5 rounded-xl border border-wing-200 text-sm focus:outline-none focus:ring-2 focus:ring-wing-400"
          />
          {error && (
            <p className="text-sm text-red-500">Fel lösenord. Försök igen.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-wing-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Kontrollerar…" : "Gå in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AccessPage() {
  return (
    <Suspense>
      <AccessForm />
    </Suspense>
  );
}

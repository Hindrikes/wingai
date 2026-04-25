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
    <div className="min-h-screen bg-sand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-3">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="9" fill="#C4532A" />
            <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
          </svg>
        </div>
        <h1 className="font-serif text-xl font-semibold text-ink-900 mb-1">Wing<em className="text-terra-500 not-italic">AI</em></h1>
        <p className="text-sm text-sand-700 mb-8">Privat beta — ange lösenord för att fortsätta</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-sand-400/60 shadow-sm p-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            autoFocus
            className="w-full px-3 py-2.5 rounded border border-sand-400 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500/40 focus:border-terra-500 bg-sand-50"
          />
          {error && (
            <p className="text-sm text-terra-500">Fel lösenord. Försök igen.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-ink-900 text-sand-100 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
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

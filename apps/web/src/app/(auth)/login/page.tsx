"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Fel e-post eller lösenord. Försök igen.");
    } else {
      router.push("/pipeline");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-sand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="9" fill="#C4532A" />
              <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
            </svg>
            <span className="font-serif font-semibold text-ink-900 text-xl">Wing<em className="text-terra-500 not-italic">AI</em></span>
          </Link>
          <p className="text-sand-700 text-sm mt-2">Logga in på ditt konto</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-sand-400/60 shadow-sm p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-sand-700 block mb-1.5">
                E-post
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="du@exempel.se"
                className="w-full px-3 py-2.5 rounded border border-sand-400 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500/40 focus:border-terra-500 transition-all bg-sand-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-sand-700 block mb-1.5">
                Lösenord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded border border-sand-400 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500/40 focus:border-terra-500 transition-all bg-sand-50"
              />
            </div>

            {error && (
              <div className="bg-terra-50 border border-terra-200 rounded px-3 py-2.5 text-sm text-terra-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-900 text-sand-100 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Loggar in…" : "Logga in"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-sand-700">
              Inget konto?{" "}
              <Link href="/register" className="text-terra-500 hover:text-terra-600 font-medium">
                Registrera dig gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

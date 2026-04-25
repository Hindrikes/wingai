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
    <div className="min-h-screen bg-gradient-to-br from-wing-50 via-white to-wing-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🦋</span>
            <span className="text-xl font-semibold text-wing-900">WingAI</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Logga in på ditt konto</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-wing-100 shadow-sm p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-wing-900 block mb-1.5">
                E-post
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="du@exempel.se"
                className="w-full px-3 py-2.5 rounded-xl border border-wing-200 text-sm focus:outline-none focus:ring-2 focus:ring-wing-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-wing-900 block mb-1.5">
                Lösenord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border border-wing-200 text-sm focus:outline-none focus:ring-2 focus:ring-wing-400 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wing-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Loggar in…" : "Logga in"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Inget konto?{" "}
              <Link href="/register" className="text-wing-600 hover:text-wing-700 font-medium">
                Registrera dig gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

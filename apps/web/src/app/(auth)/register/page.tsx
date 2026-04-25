"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Skapa UserDNA-profil
    if (data.user) {
      await supabase.from("user_profiles").insert({
        user_id: data.user.id,
        display_name: name,
        onboarding_completed: false,
      });
      router.push("/onboarding");
    } else {
      setDone(true);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">Kolla din e-post</h2>
          <p className="text-sand-700 text-sm">
            Vi har skickat en bekräftelselänk till <strong>{email}</strong>. Klicka på länken för att aktivera ditt konto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="9" fill="#C4532A" />
              <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
            </svg>
            <span className="font-serif font-semibold text-ink-900 text-xl">Wing<em className="text-terra-500 not-italic">AI</em></span>
          </Link>
          <p className="text-sand-700 text-sm mt-2">Skapa ditt gratis konto</p>
        </div>

        <div className="bg-white rounded-xl border border-sand-400/60 shadow-sm p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-sand-700 block mb-1.5">Ditt namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex"
                className="w-full px-3 py-2.5 rounded border border-sand-400 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500/40 focus:border-terra-500 transition-all bg-sand-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-sand-700 block mb-1.5">E-post</label>
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
              <label className="text-xs font-semibold uppercase tracking-wide text-sand-700 block mb-1.5">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minst 8 tecken"
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
              className="w-full bg-ink-900 text-sand-100 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-60"
            >
              {loading ? "Skapar konto…" : "Skapa konto gratis"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-sand-700">
              Har du redan ett konto?{" "}
              <Link href="/login" className="text-terra-500 hover:text-terra-600 font-medium">
                Logga in
              </Link>
            </p>
          </div>

          <p className="text-xs text-sand-600 text-center mt-4">
            Genom att registrera dig godkänner du vår{" "}
            <Link href="/privacy" className="underline hover:text-ink-700">integritetspolicy</Link>.
            GDPR-kompatibelt. Dina data stannar hos dig.
          </p>
        </div>
      </div>
    </div>
  );
}

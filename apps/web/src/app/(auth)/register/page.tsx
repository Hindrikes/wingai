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
      <div className="min-h-screen bg-gradient-to-br from-wing-50 via-white to-wing-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-xl font-semibold text-wing-900 mb-2">Kolla din e-post</h2>
          <p className="text-muted-foreground text-sm">
            Vi har skickat en bekräftelselänk till <strong>{email}</strong>. Klicka på länken för att aktivera ditt konto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wing-50 via-white to-wing-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🦋</span>
            <span className="text-xl font-semibold text-wing-900">WingAI</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Skapa ditt gratis konto</p>
        </div>

        <div className="bg-white rounded-2xl border border-wing-100 shadow-sm p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-wing-900 block mb-1.5">Ditt namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex"
                className="w-full px-3 py-2.5 rounded-xl border border-wing-200 text-sm focus:outline-none focus:ring-2 focus:ring-wing-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-wing-900 block mb-1.5">E-post</label>
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
              <label className="text-sm font-medium text-wing-900 block mb-1.5">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minst 8 tecken"
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
              className="w-full bg-wing-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Skapar konto…" : "Skapa konto gratis"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Har du redan ett konto?{" "}
              <Link href="/login" className="text-wing-600 hover:text-wing-700 font-medium">
                Logga in
              </Link>
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Genom att registrera dig godkänner du vår{" "}
            <Link href="/privacy" className="underline hover:text-foreground">integritetspolicy</Link>.
            GDPR-kompatibelt. Dina data stannar hos dig.
          </p>
        </div>
      </div>
    </div>
  );
}

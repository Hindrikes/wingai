"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  profile: Record<string, unknown> | null;
  email: string;
}

export default function SettingsClient({ profile, email }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autopilot, setAutopilot] = useState((profile?.autopilot_enabled as boolean) ?? false);
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autopilot_enabled: autopilot }),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-700 mb-1">Konto</p>
        <h1 className="font-serif text-3xl font-semibold text-ink-900 mb-1">Inställningar</h1>
        <p className="text-sm text-sand-700">Hantera din profil och preferenser.</p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border border-sand-400/60 p-6 space-y-4">
        <h2 className="font-serif font-semibold text-ink-900">Konto</h2>
        <div className="flex items-center justify-between py-2 border-b border-sand-300">
          <span className="text-sm text-sand-700">E-post</span>
          <span className="text-sm text-ink-700">{email}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-sand-300">
          <div>
            <p className="text-sm font-medium text-ink-900">Autopilot-läge</p>
            <p className="text-xs text-sand-700">WingAI föreslår svar automatiskt</p>
          </div>
          <button
            onClick={() => setAutopilot(!autopilot)}
            className={`relative w-11 h-6 rounded-full transition-colors ${autopilot ? "bg-terra-500" : "bg-sand-400"}`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autopilot ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

      {/* DNA Profile */}
      <div className="bg-white rounded-xl border border-sand-400/60 p-6 space-y-4">
        <h2 className="font-serif font-semibold text-ink-900">Din UserDNA-profil</h2>
        {profile ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-sand-700">Anknytningsstil</span>
              <span className="font-medium text-ink-800 capitalize">{(profile.attachment_style as string) ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-700">Humorregister</span>
              <span className="font-medium text-ink-800 capitalize">{(profile.humor_register as string) ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-700">Openersstil</span>
              <span className="font-medium text-ink-800 capitalize">{(profile.opener_style as string) ?? "—"}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-sand-700">Profil ej klar. Slutför onboarding.</p>
        )}
        <button
          onClick={() => router.push("/onboarding")}
          className="text-sm text-terra-500 hover:text-terra-600 font-medium"
        >
          Gör om kartläggning →
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-ink-900 text-sand-100 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
        >
          {saved ? "Sparat ✓" : saving ? "Sparar…" : "Spara inställningar"}
        </button>
        <button
          onClick={handleSignOut}
          className="w-full border border-terra-200 text-terra-600 py-2.5 rounded text-sm font-medium hover:bg-terra-50 transition-colors"
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}

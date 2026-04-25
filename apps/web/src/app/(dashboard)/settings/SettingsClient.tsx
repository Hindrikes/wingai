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
        <h1 className="text-2xl font-semibold text-wing-900 mb-1">Inställningar</h1>
        <p className="text-sm text-muted-foreground">Hantera din profil och preferenser.</p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-wing-100 p-6 space-y-4">
        <h2 className="font-medium text-wing-900">Konto</h2>
        <div className="flex items-center justify-between py-2 border-b border-wing-50">
          <span className="text-sm text-wing-700">E-post</span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-wing-50">
          <div>
            <p className="text-sm font-medium text-wing-900">Autopilot-läge</p>
            <p className="text-xs text-muted-foreground">WingAI föreslår svar automatiskt</p>
          </div>
          <button
            onClick={() => setAutopilot(!autopilot)}
            className={`relative w-11 h-6 rounded-full transition-colors ${autopilot ? "bg-wing-600" : "bg-wing-200"}`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autopilot ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

      {/* DNA Profile */}
      <div className="bg-white rounded-2xl border border-wing-100 p-6 space-y-4">
        <h2 className="font-medium text-wing-900">Din UserDNA-profil</h2>
        {profile ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anknytningsstil</span>
              <span className="font-medium capitalize">{(profile.attachment_style as string) ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Humorregister</span>
              <span className="font-medium capitalize">{(profile.humor_register as string) ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Openersstil</span>
              <span className="font-medium capitalize">{(profile.opener_style as string) ?? "—"}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Profil ej klar. Slutför onboarding.</p>
        )}
        <button
          onClick={() => router.push("/onboarding")}
          className="text-sm text-wing-600 hover:text-wing-700 font-medium"
        >
          Gör om kartläggning →
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-wing-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-50"
        >
          {saved ? "Sparat ✓" : saving ? "Sparar…" : "Spara inställningar"}
        </button>
        <button
          onClick={handleSignOut}
          className="w-full border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}

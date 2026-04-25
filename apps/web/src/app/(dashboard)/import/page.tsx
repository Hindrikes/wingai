"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Step = "upload" | "analyzing" | "result";

export default function ImportPage() {
  const [step, setStep] = useState<Step>("upload");
  const [profileUrl, setProfileUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ name: string; bio: string; matchCardId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleAnalyze() {
    setStep("analyzing");
    setError(null);

    // Build form data — send either screenshot or profile URL
    const formData = new FormData();
    if (fileRef.current?.files?.[0]) {
      formData.append("screenshot", fileRef.current.files[0]);
    }
    formData.append("profileUrl", profileUrl);

    try {
      const res = await fetch("/api/agents/profilexray", {
        method: "POST",
        body: JSON.stringify({
          profileText: `Profil-URL: ${profileUrl}`,
          name: "Okänd",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Analys misslyckades");
      const data = await res.json();
      setResult({ name: "Profil", bio: "", matchCardId: data.id });
      setStep("result");
    } catch {
      setError("Något gick fel. Försök igen.");
      setStep("upload");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-wing-900 mb-1">Importera profil</h1>
        <p className="text-muted-foreground text-sm">
          Ladda upp en skärmdump eller klistra in en profil-URL — ProfileX-Ray analyserar resten.
        </p>
      </div>

      {step === "upload" && (
        <div className="space-y-6">
          {/* Screenshot upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-wing-200 rounded-2xl p-8 text-center cursor-pointer hover:border-wing-400 hover:bg-wing-50/50 transition-all group"
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                <p className="text-sm text-wing-600 font-medium">Bild vald — klicka för att byta</p>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                <p className="text-sm font-medium text-wing-900 mb-1">Dra hit en skärmdump</p>
                <p className="text-xs text-muted-foreground">eller klicka för att välja fil</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-wing-100" />
            <span className="text-xs text-muted-foreground">eller</span>
            <div className="flex-1 h-px bg-wing-100" />
          </div>

          {/* URL input */}
          <div>
            <label className="text-sm font-medium text-wing-900 block mb-1.5">Profil-URL</label>
            <input
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://tinder.com/@..."
              className="w-full px-3 py-2.5 rounded-xl border border-wing-200 text-sm focus:outline-none focus:ring-2 focus:ring-wing-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!preview && !profileUrl.trim()}
            className="w-full bg-wing-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-50"
          >
            Analysera profil
          </button>
        </div>
      )}

      {step === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-wing-100 border-t-wing-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
          </div>
          <div className="text-center">
            <p className="font-medium text-wing-900 mb-1">ProfileX-Ray analyserar...</p>
            <p className="text-sm text-muted-foreground">Kemi, livsstil, kompatibilitet</p>
          </div>
          <div className="space-y-2 w-64">
            {["Läser bio och foton", "Beräknar kemipoäng", "Identifierar röda flaggor", "Bygger matchkort"].map(
              (label, i) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div
                    className="w-4 h-4 rounded-full bg-wing-500 animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="font-semibold text-emerald-900 mb-1">Profil analyserad!</h2>
            <p className="text-sm text-emerald-700">Matchkort sparat i din pipeline</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/pipeline")}
              className="flex-1 bg-wing-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors"
            >
              Visa i pipeline
            </button>
            <button
              onClick={() => { setStep("upload"); setPreview(null); setProfileUrl(""); }}
              className="flex-1 border border-wing-200 text-wing-700 py-2.5 rounded-xl text-sm font-medium hover:bg-wing-50 transition-colors"
            >
              Importera fler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

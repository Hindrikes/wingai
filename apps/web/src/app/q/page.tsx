"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

const PLATFORMS = [
  { id: "hinge", label: "Hinge", emoji: "💚" },
  { id: "tinder", label: "Tinder", emoji: "🔥" },
  { id: "bumble", label: "Bumble", emoji: "🐝" },
  { id: "other", label: "Annat", emoji: "💬" },
];

type Suggestion = {
  style: "safe" | "playful" | "bold";
  text: string;
  confidence: number;
  reasoning?: string;
};

const STYLE_LABEL: Record<string, string> = { safe: "SÄKER", playful: "LEKFULL", bold: "DJÄRV" };
const STYLE_COLOR: Record<string, string> = { safe: "#2D4A32", playful: "#92400e", bold: "#9B1C1C" };
const STYLE_BG: Record<string, string> = {
  safe: "rgba(45,74,50,0.07)",
  playful: "rgba(146,64,14,0.07)",
  bold: "rgba(155,28,28,0.07)",
};

export default function QuickReplyPage() {
  const [platform, setPlatform] = useState("hinge");
  const [theirMsg, setTheirMsg] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [clipboardWatching, setClipboardWatching] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Clipboard watch — auto-fills when user copies a message from dating app
  useEffect(() => {
    if (!clipboardWatching) return;
    let last = "";
    const interval = setInterval(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text !== last && text.length < 500 && text.length > 2) {
          last = text;
          setTheirMsg(text);
          setClipboardWatching(false);
        }
      } catch {}
    }, 800);
    return () => clearInterval(interval);
  }, [clipboardWatching]);

  async function analyze() {
    if (!theirMsg.trim()) return;
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch(`${API_BASE}/api/agents/convoos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          matchId: `${platform}-quick`,
          ownMessage: theirMsg,
          matchName: "Match",
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
    } catch {}
    setLoading(false);
  }

  async function copy(text: string, style: string) {
    await navigator.clipboard.writeText(text);
    setCopied(style);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#FAF6F0",
        fontFamily: "var(--font-instrument, system-ui, sans-serif)",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #D9CEBC",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FAF6F0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="9" fill="#C4532A" />
            <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
          </svg>
          <span style={{ fontFamily: "var(--font-fraunces, Georgia, serif)", fontWeight: 600, fontSize: 17, color: "#1C1916" }}>
            Snabbt svar
          </span>
        </div>
        <Link href="/pipeline" style={{ fontSize: 12, color: "#8C7B6B", textDecoration: "none" }}>
          Pipeline →
        </Link>
      </div>

      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Platform selector */}
        <div style={{ display: "flex", gap: 8 }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 8,
                border: platform === p.id ? "1.5px solid #1C1916" : "1.5px solid #D9CEBC",
                background: platform === p.id ? "#1C1916" : "white",
                color: platform === p.id ? "#FAF6F0" : "#8C7B6B",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}
            >
              <span style={{ fontSize: 16 }}>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Message input */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8C7B6B" }}>
              Deras meddelande
            </label>
            <button
              onClick={() => setClipboardWatching(true)}
              style={{
                fontSize: 10, fontWeight: 600, color: "#C4532A",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {clipboardWatching ? "⏳ Väntar på urklipp…" : "📋 Klistra från urklipp"}
            </button>
          </div>
          <textarea
            ref={textRef}
            value={theirMsg}
            onChange={(e) => setTheirMsg(e.target.value)}
            placeholder="Klistra in eller skriv deras meddelande här…"
            rows={4}
            style={{
              width: "100%", padding: "12px", borderRadius: 8,
              border: "1.5px solid #D9CEBC", fontSize: 15, resize: "none",
              fontFamily: "inherit", outline: "none", background: "white",
              boxSizing: "border-box", color: "#1C1916", lineHeight: 1.5,
            }}
            onFocus={() => setClipboardWatching(false)}
          />
        </div>

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={loading || !theirMsg.trim()}
          style={{
            width: "100%", padding: "14px",
            background: loading || !theirMsg.trim() ? "#C5B8A6" : "#1C1916",
            color: "#FAF6F0", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: loading || !theirMsg.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit", letterSpacing: 0.3,
            transition: "background 0.15s",
          }}
        >
          {loading ? "Analyserar…" : "Få svarsförslag ↗"}
        </button>

        {/* Suggestions */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 80, background: "#EDE4D6", borderRadius: 10, animation: "pulse 1.5s ease-in-out infinite", opacity: 0.6 + i * 0.1 }} />
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8C7B6B" }}>
              Förslag
            </div>
            {suggestions.map((s) => (
              <div
                key={s.style}
                style={{
                  background: STYLE_BG[s.style] ?? "#F5EFE6",
                  borderRadius: 10, padding: "14px",
                  border: `1px solid ${STYLE_COLOR[s.style]}22`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: STYLE_COLOR[s.style], letterSpacing: 1 }}>
                    {STYLE_LABEL[s.style] ?? s.style.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 10, color: "#8C7B6B" }}>{s.confidence}%</span>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "#1C1916", margin: "0 0 12px" }}>
                  {s.text}
                </p>
                <button
                  onClick={() => copy(s.text, s.style)}
                  style={{
                    width: "100%", padding: "10px",
                    background: copied === s.style ? "#2D4A32" : "#1C1916",
                    color: "#FAF6F0", border: "none", borderRadius: 6,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: 0.3,
                    transition: "background 0.15s",
                  }}
                >
                  {copied === s.style ? "✓ Kopierat — klistra in i appen!" : "Kopiera svar"}
                </button>
                {s.reasoning && (
                  <p style={{ fontSize: 11, color: "#8C7B6B", margin: "8px 0 0", fontStyle: "italic", lineHeight: 1.4 }}>
                    {s.reasoning}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions when empty */}
        {!loading && suggestions.length === 0 && !theirMsg && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#8C7B6B" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📲</div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#3D3630", marginBottom: 6 }}>
              Hur använder du detta?
            </p>
            <ol style={{ textAlign: "left", fontSize: 12, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
              <li>Kopiera deras senaste meddelande i {PLATFORMS.find(p=>p.id===platform)?.label ?? "appen"}</li>
              <li>Tryck "Klistra från urklipp" ovan</li>
              <li>Välj ett förslag och kopiera</li>
              <li>Klistra in i {PLATFORMS.find(p=>p.id===platform)?.label ?? "appen"} och skicka</li>
            </ol>
          </div>
        )}
      </div>

      {/* Bottom safe area */}
      <div style={{ height: "env(safe-area-inset-bottom, 16px)" }} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.3} }
        * { -webkit-tap-highlight-color: transparent; }
        textarea:focus { border-color: #C4532A !important; box-shadow: 0 0 0 3px rgba(196,83,42,0.12); }
      `}</style>
    </div>
  );
}

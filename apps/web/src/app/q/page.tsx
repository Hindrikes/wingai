"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

const PLATFORMS = [
  { id: "hinge",  label: "Hinge",  color: "#23695b" },
  { id: "tinder", label: "Tinder", color: "#e94057" },
  { id: "bumble", label: "Bumble", color: "#ffcf00" },
  { id: "other",  label: "Annat",  color: "#8C7B6B" },
];

type Suggestion = {
  style: "safe" | "playful" | "bold";
  text: string;
  confidence: number;
  reasoning?: string;
};

const STYLE_LABEL: Record<string, string>  = { safe: "SÄKER", playful: "LEKFULL", bold: "DJÄRV" };
const STYLE_COLOR: Record<string, string>  = { safe: "#2D4A32", playful: "#92400e", bold: "#9B1C1C" };
const STYLE_BG: Record<string, string>     = {
  safe:    "rgba(45,74,50,0.07)",
  playful: "rgba(146,64,14,0.07)",
  bold:    "rgba(155,28,28,0.07)",
};

// ─── Inner component (uses useSearchParams) ────────────────────────────────
function QuickReply() {
  const params = useSearchParams();
  const urlMessage = params.get("m") ?? "";

  const [platform,    setPlatform]    = useState("hinge");
  const [theirMsg,    setTheirMsg]    = useState(urlMessage);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [copied,      setCopied]      = useState<string | null>(null);
  const [status,      setStatus]      = useState<"idle" | "clipboard" | "analyzing" | "done" | "error">("idle");
  const didAutoRef = useRef(false);

  // ── On mount: try URL param first, then clipboard ─────────────────────────
  useEffect(() => {
    if (didAutoRef.current) return;
    didAutoRef.current = true;

    if (urlMessage.trim()) {
      autoAnalyze(urlMessage.trim());
      return;
    }

    // Try clipboard immediately (permissions may already be granted)
    readClipboardAndAnalyze();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function readClipboardAndAnalyze() {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 2 && text.length < 600 && !text.startsWith("http")) {
        setTheirMsg(text.trim());
        setStatus("clipboard");
        // Short delay so user sees what was picked up, then auto-analyze
        await new Promise(r => setTimeout(r, 700));
        autoAnalyze(text.trim());
      }
    } catch {
      // Permission denied — user will type/paste manually
      setStatus("idle");
    }
  }

  async function autoAnalyze(msg: string) {
    if (!msg.trim()) return;
    setStatus("analyzing");
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch(`${API_BASE}/api/agents/convoos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          matchId: `${platform}-quick`,
          ownMessage: msg,
          matchName: "Match",
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setStatus(data.suggestions?.length ? "done" : "error");
    } catch {
      setStatus("error");
    }
    setLoading(false);
  }

  async function handleManualAnalyze() {
    await autoAnalyze(theirMsg);
  }

  async function copy(text: string, style: string) {
    await navigator.clipboard.writeText(text);
    setCopied(style);
    // Vibrate on mobile for tactile feedback
    if (navigator.vibrate) navigator.vibrate(40);
    setTimeout(() => setCopied(null), 3000);
  }

  const showInput = status === "idle" || status === "error";

  return (
    <div style={shell}>
      {/* ── Header ── */}
      <div style={header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="9" fill="#C4532A"/>
            <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95"/>
          </svg>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: 16, color: "#1C1916" }}>
            WingAI
          </span>
        </div>
        <Link href="/setup" style={{ fontSize: 11, color: "#8C7B6B", textDecoration: "none", padding: "4px 10px", border: "1px solid #D9CEBC", borderRadius: 20 }}>
          Inställning ⚙
        </Link>
      </div>

      <div style={{ flex: 1, padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* ── Platform pills ── */}
        <div style={{ display: "flex", gap: 6 }}>
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 8,
                border: `1.5px solid ${platform === p.id ? p.color : "#D9CEBC"}`,
                background: platform === p.id ? p.color : "white",
                color: platform === p.id ? "white" : "#8C7B6B",
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── State: analyzing ── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#8C7B6B", textAlign: "center", padding: "8px 0" }}>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
              {" "}Genererar svar för: <em style={{ color: "#1C1916" }}>{theirMsg.slice(0, 40)}{theirMsg.length > 40 ? "…" : ""}</em>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 76, background: "#EDE4D6", borderRadius: 10, animation: "pulse 1.4s ease-in-out infinite", opacity: 0.5 + i * 0.15 }} />
            ))}
          </div>
        )}

        {/* ── State: suggestions ready ── */}
        {!loading && suggestions.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8C7B6B" }}>
                Förslag
              </div>
              <button
                onClick={() => { setTheirMsg(""); setSuggestions([]); setStatus("idle"); didAutoRef.current = false; }}
                style={{ fontSize: 11, color: "#C4532A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ↩ Nytt
              </button>
            </div>

            {/* Original message chip */}
            <div style={{ background: "#F5EFE6", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#6B5D52", border: "1px solid #EDE4D6" }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8C7B6B", display: "block", marginBottom: 3 }}>Deras meddelande</span>
              {theirMsg.slice(0, 100)}{theirMsg.length > 100 ? "…" : ""}
            </div>

            {suggestions.map((s, i) => (
              <div
                key={s.style}
                style={{
                  background: STYLE_BG[s.style] ?? "#F5EFE6",
                  borderRadius: 12, padding: "14px",
                  border: `1px solid ${STYLE_COLOR[s.style]}22`,
                  position: "relative",
                }}
              >
                {i === 0 && (
                  <div style={{ position: "absolute", top: -8, left: 14, background: "#C4532A", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.8 }}>
                    BÄST
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, marginTop: i === 0 ? 4 : 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: STYLE_COLOR[s.style], letterSpacing: 1.2 }}>
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
                    width: "100%", padding: "12px",
                    background: copied === s.style ? "#2D4A32" : "#1C1916",
                    color: "#FAF6F0", border: "none", borderRadius: 8,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit", transition: "background 0.15s",
                    letterSpacing: 0.3,
                  }}
                >
                  {copied === s.style ? "✓ Kopierat — gå tillbaka och klistra in" : "Kopiera svar"}
                </button>
              </div>
            ))}
          </>
        )}

        {/* ── State: manual input ── */}
        {showInput && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {status === "error" && (
              <div style={{ background: "#FEF2EE", border: "1px solid #F3C4AF", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#9B1C1C" }}>
                Något gick fel. Klistra in meddelandet nedan och försök igen.
              </div>
            )}

            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8C7B6B", display: "block", marginBottom: 6 }}>
                Klistra in deras meddelande
              </label>
              <textarea
                value={theirMsg}
                onChange={e => setTheirMsg(e.target.value)}
                placeholder="Kopiera från Hinge/Tinder och klistra in här…"
                rows={4}
                autoFocus
                style={{
                  width: "100%", padding: "12px", borderRadius: 8,
                  border: "1.5px solid #D9CEBC", fontSize: 15, resize: "none",
                  fontFamily: "inherit", outline: "none", background: "white",
                  boxSizing: "border-box", color: "#1C1916", lineHeight: 1.5,
                }}
              />
            </div>

            <button
              onClick={handleManualAnalyze}
              disabled={!theirMsg.trim()}
              style={{
                width: "100%", padding: "14px",
                background: !theirMsg.trim() ? "#C5B8A6" : "#1C1916",
                color: "#FAF6F0", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600,
                cursor: !theirMsg.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit", letterSpacing: 0.3,
              }}
            >
              Få svarsförslag →
            </button>

            {/* How-to */}
            <div style={{ background: "white", borderRadius: 10, padding: "14px 16px", border: "1px solid #EDE4D6" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#8C7B6B", marginBottom: 8 }}>
                Smidigaste sättet
              </div>
              <ol style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: "#6B5D52", lineHeight: 2, listStyleType: "none", counterReset: "steps" }}>
                {[
                  "Håll in deras meddelande i Hinge → Kopiera",
                  "Byt app → WingAI öppnas och analyserar automatiskt",
                  "Tryck Kopiera svar",
                  "Gå tillbaka → Klistra in → Skicka",
                ].map((step, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                    <span style={{ width: 18, height: 18, background: "#1C1916", color: "#FAF6F0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link href="/setup" style={{ display: "block", marginTop: 10, fontSize: 12, color: "#C4532A", textDecoration: "none", fontWeight: 600 }}>
                Konfigurera iOS-genväg för 1-tryck →
              </Link>
            </div>
          </div>
        )}

        {/* ── Clipboard permission note ── */}
        {status === "idle" && !loading && suggestions.length === 0 && !theirMsg && (
          <button
            onClick={readClipboardAndAnalyze}
            style={{
              width: "100%", padding: "12px",
              background: "white", border: "1.5px solid #D9CEBC",
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              color: "#3D3630", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            📋 Läs från urklipp
          </button>
        )}
      </div>

      {/* ── Login link ── */}
      <div style={{ textAlign: "center", padding: "0 0 16px", fontSize: 11, color: "#B09E8E" }}>
        <Link href="/pipeline" style={{ color: "#8C7B6B", textDecoration: "none" }}>Pipeline →</Link>
        {" · "}
        <Link href="/login" style={{ color: "#8C7B6B", textDecoration: "none" }}>Logga in →</Link>
      </div>

      <div style={{ height: "env(safe-area-inset-bottom, 12px)" }} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:.25} }
        @keyframes spin { to { transform: rotate(360deg) } }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        textarea:focus { border-color: #C4532A !important; box-shadow: 0 0 0 3px rgba(196,83,42,0.1); }
      `}</style>
    </div>
  );
}

// ─── Shell styles ──────────────────────────────────────────────────────────
const shell: React.CSSProperties = {
  minHeight: "100svh",
  background: "#FAF6F0",
  fontFamily: "system-ui, -apple-system, sans-serif",
  display: "flex",
  flexDirection: "column",
  maxWidth: 480,
  margin: "0 auto",
};

const header: React.CSSProperties = {
  padding: "14px 20px 12px",
  borderBottom: "1px solid #D9CEBC",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#FAF6F0",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

// ─── Page export (Suspense for useSearchParams) ────────────────────────────
export default function QuickReplyPage() {
  return (
    <Suspense>
      <QuickReply />
    </Suspense>
  );
}

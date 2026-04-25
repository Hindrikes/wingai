"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Step data ─────────────────────────────────────────────────────────────
const IOS_STEPS = [
  {
    num: 1,
    title: "Öppna Genvägar-appen",
    desc: "Finns förinstallerad på iPhone. Sök efter den om du inte hittar den.",
    icon: "🔖",
  },
  {
    num: 2,
    title: 'Tryck "+" → Lägg till åtgärd',
    desc: 'Välj "Åtgärder" och sök efter "Urklipp". Välj "Hämta urklipp".',
    icon: "➕",
  },
  {
    num: 3,
    title: "Lägg till URL-åtgärd",
    desc: 'Sök efter "Öppna URL". Skriv in URL:en nedan som mål.',
    icon: "🔗",
  },
  {
    num: 4,
    title: "Konfigurera URL:en",
    desc: 'URL ska vara: wingai-umber.vercel.app/q?m=[Urklipp]\nByta ut [Urklipp] mot variabeln "Urklipp" från steg 2.',
    icon: "⚙️",
  },
  {
    num: 5,
    title: "Namnge och spara",
    desc: 'Namnge genvägen "WingAI". Välj en vinge-emoji 🦋 som ikon.',
    icon: "💾",
  },
  {
    num: 6,
    title: "Lägg till på hemskärmen",
    desc: "Tryck på genvägsinformationen (⋯) → Lägg till på hemskärmen. Nu finns den alltid ett tryck bort!",
    icon: "📱",
  },
];

const ANDROID_STEPS = [
  {
    num: 1,
    title: "Öppna WingAI i Chrome",
    desc: "Gå till wingai-umber.vercel.app i Chrome på Android.",
    icon: "🌐",
  },
  {
    num: 2,
    title: "Lägg till på hemskärmen",
    desc: 'Tryck på menyn (⋮) → "Lägg till på hemskärmen". Appen installeras som en PWA.',
    icon: "📱",
  },
  {
    num: 3,
    title: "Kopiera meddelande i Hinge",
    desc: "Håll inne ett meddelande → Kopiera.",
    icon: "📋",
  },
  {
    num: 4,
    title: "Öppna WingAI",
    desc: "Tryck på WingAI-ikonen på hemskärmen. Appen läser automatiskt urklippet.",
    icon: "🦋",
  },
];

const FLOW_STEPS = [
  { icon: "💬", label: "Håll inne meddelandet i Hinge/Tinder", sub: "Välj Kopiera" },
  { icon: "📱", label: "Byt app → öppna WingAI", sub: "Hemskärmsikon eller genväg" },
  { icon: "✨", label: "WingAI analyserar automatiskt", sub: "Inget behov av att klistra in" },
  { icon: "📋", label: "Tryck Kopiera svar", sub: "Välj den ton du vill ha" },
  { icon: "↩️", label: "Gå tillbaka → klistra in → skicka", sub: "Hela flödet på under 15 sek" },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function SetupPage() {
  const [tab, setTab] = useState<"ios" | "android">("ios");

  return (
    <div style={shell}>
      {/* Header */}
      <div style={header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="9" fill="#C4532A" />
            <path
              d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z"
              fill="white"
              opacity="0.95"
            />
          </svg>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: 16, color: "#1C1916" }}>
            WingAI
          </span>
        </div>
        <Link
          href="/q"
          style={{ fontSize: 11, color: "#8C7B6B", textDecoration: "none", padding: "4px 10px", border: "1px solid #D9CEBC", borderRadius: 20 }}
        >
          ← Tillbaka
        </Link>
      </div>

      <div style={{ flex: 1, padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Hero */}
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 600, color: "#1C1916", margin: "0 0 6px" }}>
            1-tryck flöde
          </h1>
          <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, lineHeight: 1.6 }}>
            Konfigurera WingAI för det smidigaste möjliga sättet att svara på meddelanden.
          </p>
        </div>

        {/* The flow */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #EDE4D6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #EDE4D6", background: "#FAF6F0" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8C7B6B" }}>
              Hur det fungerar
            </span>
          </div>
          <div style={{ padding: "4px 0" }}>
            {FLOW_STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < FLOW_STEPS.length - 1 ? "1px solid #F5EFE6" : "none",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: "#FAF6F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1916", lineHeight: 1.4 }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: "#8C7B6B", marginTop: 2 }}>{step.sub}</div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div style={{ marginLeft: "auto", fontSize: 16, color: "#D9CEBC", alignSelf: "center" }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Platform tabs */}
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["ios", "android"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "10px 4px", borderRadius: 8, border: `1.5px solid ${tab === t ? "#1C1916" : "#D9CEBC"}`,
                  background: tab === t ? "#1C1916" : "white",
                  color: tab === t ? "#FAF6F0" : "#8C7B6B",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {t === "ios" ? "🍎 iPhone / iOS" : "🤖 Android"}
              </button>
            ))}
          </div>

          {tab === "ios" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* iOS Shortcut URL helper */}
              <div style={{
                background: "rgba(196,83,42,0.06)", border: "1px solid rgba(196,83,42,0.2)",
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#C4532A", marginBottom: 6 }}>
                  Genvägs-URL
                </div>
                <div style={{
                  fontFamily: "monospace", fontSize: 12, color: "#1C1916",
                  background: "white", border: "1px solid #EDE4D6",
                  borderRadius: 6, padding: "8px 10px", wordBreak: "break-all", lineHeight: 1.5,
                }}>
                  wingai-umber.vercel.app/q?m=<span style={{ color: "#C4532A", fontWeight: 700 }}>[Urklipp]</span>
                </div>
                <p style={{ fontSize: 11, color: "#8C7B6B", margin: "8px 0 0", lineHeight: 1.5 }}>
                  Byt ut <strong>[Urklipp]</strong> mot variabeln "Urklipp" i Genvägar-appen.
                </p>
              </div>

              {IOS_STEPS.map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: "flex", gap: 12, background: "white",
                    borderRadius: 10, padding: "12px 14px",
                    border: "1px solid #EDE4D6",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, background: "#1C1916",
                    color: "#FAF6F0", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1916", marginBottom: 3 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: "#6B5D52", lineHeight: 1.5, whiteSpace: "pre-line" }}>{step.desc}</div>
                  </div>
                </div>
              ))}

              {/* Add to home screen tip */}
              <div style={{
                background: "rgba(45,74,50,0.06)", border: "1px solid rgba(45,74,50,0.15)",
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2D4A32", marginBottom: 6 }}>
                  Bonus: PWA på hemskärmen
                </div>
                <p style={{ fontSize: 12, color: "#3D4F3F", margin: 0, lineHeight: 1.6 }}>
                  Öppna <strong>wingai-umber.vercel.app</strong> i Safari →
                  tryck Dela-ikonen → "Lägg till på hemskärmen".
                  Du får en riktig app-ikon utan App Store!
                </p>
              </div>
            </div>
          )}

          {tab === "android" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ANDROID_STEPS.map((step) => (
                <div
                  key={step.num}
                  style={{
                    display: "flex", gap: 12, background: "white",
                    borderRadius: 10, padding: "12px 14px",
                    border: "1px solid #EDE4D6",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, background: "#1C1916",
                    color: "#FAF6F0", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1916", marginBottom: 3 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: "#6B5D52", lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              ))}

              <div style={{
                background: "rgba(45,74,50,0.06)", border: "1px solid rgba(45,74,50,0.15)",
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2D4A32", marginBottom: 6 }}>
                  Tips
                </div>
                <p style={{ fontSize: 12, color: "#3D4F3F", margin: 0, lineHeight: 1.6 }}>
                  På Android kan du använda delat skärm (håll in app-switcher-knappen) för att ha Hinge och WingAI sida vid sida.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Multitasking tip */}
        <div style={{ background: "#1C1916", borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8C7B6B", marginBottom: 8 }}>
            Pro-tips
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Swipe tillbaka i webbläsaren för att komma tillbaka direkt till konversationen",
              "Kopiera-knappen visar 'Kopierat — gå tillbaka och klistra in' som en påminnelse",
              "iPhone-genvägen körs direkt från låsskärmen om du lägger till den i Åtgärdscentret",
              "Inga konton krävs — /q fungerar utan inloggning",
            ].map((tip, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#C5B8A6", lineHeight: 1.5 }}>
                <span style={{ color: "#C4532A", flexShrink: 0 }}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/q"
          style={{
            display: "block", width: "100%", padding: "14px",
            background: "#C4532A", color: "#FAF6F0",
            border: "none", borderRadius: 8, textAlign: "center",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            fontFamily: "inherit", letterSpacing: 0.3,
            boxSizing: "border-box",
          }}
        >
          Testa snabbsvaret nu →
        </Link>
      </div>

      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      `}</style>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
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

import { useState } from "react"

const API_BASE = "https://wingai-umber.vercel.app"

const STYLE_LABELS: Record<string, string> = {
  safe: "Säker",
  playful: "Lekfull",
  bold: "Djärv",
}

const STYLE_COLORS: Record<string, string> = {
  safe: "#6171f1",
  playful: "#f59e0b",
  bold: "#f87171",
}

interface Suggestion {
  style: string
  text: string
  confidence: number
  reasoning: string
}

interface Analysis {
  suggestions: Suggestion[]
  stageInsight?: string
  optimalAction?: string
}

export default function Popup() {
  const [theirMessage, setTheirMessage] = useState("")
  const [matchName, setMatchName] = useState("")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function analyze() {
    if (!theirMessage.trim()) return
    setLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const res = await fetch(`${API_BASE}/api/agents/convoos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          matchId: "ext-" + Date.now(),
          ownMessage: theirMessage,
          matchName: matchName || "Match",
        }),
      })
      if (!res.ok) throw new Error("Fel vid analys")
      const data = await res.json()
      setAnalysis(data)
    } catch {
      setError("Kunde inte ansluta till WingAI. Är du inloggad?")
    }
    setLoading(false)
  }

  async function copy(text: string, style: string) {
    await navigator.clipboard.writeText(text)
    setCopied(style)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ width: 360, fontFamily: "system-ui, sans-serif", background: "#fafaf9", minHeight: 400 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #6171f1, #8b5cf6)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🦋</span>
        <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>WingAI</span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginLeft: "auto" }}>ConvoOS</span>
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Match name */}
        <input
          value={matchName}
          onChange={e => setMatchName(e.target.value)}
          placeholder="Matchens namn (valfritt)"
          style={inputStyle}
        />

        {/* Their message */}
        <textarea
          value={theirMessage}
          onChange={e => setTheirMessage(e.target.value)}
          placeholder="Klistra in deras senaste meddelande…"
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
          onKeyDown={e => { if (e.key === "Enter" && e.metaKey) analyze() }}
        />

        <button
          onClick={analyze}
          disabled={loading || !theirMessage.trim()}
          style={btnStyle(loading || !theirMessage.trim())}
        >
          {loading ? "Analyserar…" : "Få svarsförslag ↗"}
        </button>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#dc2626" }}>
            {error} — <a href={API_BASE + "/login"} target="_blank" rel="noreferrer" style={{ color: "#6171f1" }}>Logga in</a>
          </div>
        )}

        {/* Insight */}
        {analysis?.stageInsight && (
          <div style={{ background: "#eff0fe", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#4338ca" }}>
            💡 {analysis.stageInsight}
          </div>
        )}

        {/* Suggestions */}
        {analysis?.suggestions.map(s => (
          <div key={s.style} style={{ background: "white", border: "1px solid #e8e8f0", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: STYLE_COLORS[s.style], letterSpacing: 1 }}>
                [{STYLE_LABELS[s.style] ?? s.style}]
              </span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{s.confidence}%</span>
            </div>
            <p style={{ fontSize: 13, color: "#1a1a2e", margin: "0 0 8px", lineHeight: 1.5 }}>{s.text}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => copy(s.text, s.style)}
                style={smallBtnStyle}
              >
                {copied === s.style ? "✓ Kopierat!" : "Kopiera"}
              </button>
              <span style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>{s.reasoning}</span>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <a href={API_BASE + "/pipeline"} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#9ca3af", textDecoration: "none" }}>
            Öppna WingAI ↗
          </a>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e8e8f0",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? "#c7c7f0" : "linear-gradient(135deg, #6171f1, #8b5cf6)",
  color: "white",
  border: "none",
  borderRadius: 9,
  padding: "10px 0",
  fontWeight: 600,
  fontSize: 13,
  cursor: disabled ? "not-allowed" : "pointer",
  width: "100%",
  fontFamily: "inherit",
})

const smallBtnStyle: React.CSSProperties = {
  background: "#f5f5fd",
  color: "#6171f1",
  border: "none",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
}

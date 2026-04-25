import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://tinder.com/*"],
  all_frames: false,
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector(".messageInput, [class*='messageInput'], textarea[placeholder*='send' i], textarea[placeholder*='message' i]") as Element

function getLastIncomingMessage(): string {
  const msgs = document.querySelectorAll("[class*='messageListItem--received'], [class*='received']")
  if (msgs.length === 0) return ""
  return msgs[msgs.length - 1]?.textContent?.trim() ?? ""
}

function getMatchName(): string {
  return document.querySelector("[class*='matchName'], h1, [class*='name']")?.textContent?.trim() ?? "Match"
}

const API_BASE = "https://wingai-umber.vercel.app"

export default function TinderOverlay() {
  const [open, setOpen] = useState(false)
  const [theirMsg, setTheirMsg] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      const auto = getLastIncomingMessage()
      if (auto) setTheirMsg(auto)
    }
  }, [open])

  async function analyze() {
    if (!theirMsg.trim()) return
    setLoading(true)
    setAnalysis(null)
    try {
      const res = await fetch(`${API_BASE}/api/agents/convoos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ matchId: "tinder-ext", ownMessage: theirMsg, matchName: getMatchName() }),
      })
      setAnalysis(await res.json())
    } catch {}
    setLoading(false)
  }

  async function copyAndFill(text: string, style: string) {
    await navigator.clipboard.writeText(text)
    setCopied(style)
    const input = document.querySelector<HTMLTextAreaElement>(".messageInput, textarea[placeholder*='send' i]")
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set
      nativeSetter?.call(input, text)
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.focus()
    }
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ position: "relative", display: "inline-block", margin: "4px 0" }}>
      <button onClick={() => setOpen(o => !o)} style={triggerBtn} title="WingAI svarsförslag">
        🦋 WingAI
      </button>

      {open && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700, color: "#6171f1" }}>
            <span>🦋 WingAI · ConvoOS</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 14, padding: 0 }}>✕</button>
          </div>

          <textarea
            value={theirMsg}
            onChange={e => setTheirMsg(e.target.value)}
            placeholder="Deras senaste meddelande…"
            rows={3}
            style={{ width: "100%", padding: "7px 9px", border: "1px solid #e8e8f0", borderRadius: 8, fontSize: 12, resize: "none", fontFamily: "inherit", boxSizing: "border-box" as const, outline: "none" }}
          />

          <button onClick={analyze} disabled={loading || !theirMsg.trim()} style={{ background: loading || !theirMsg.trim() ? "#c7c7f0" : "linear-gradient(135deg, #6171f1, #8b5cf6)", color: "white", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", width: "100%", fontFamily: "inherit" }}>
            {loading ? "Analyserar…" : "Få förslag ↗"}
          </button>

          {analysis?.suggestions?.map((s: any) => (
            <div key={s.style} style={{ background: "#fafaf9", border: "1px solid #f0f0f8", borderRadius: 9, padding: "8px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: { safe: "#6171f1", playful: "#f59e0b", bold: "#f87171" }[s.style as string] ?? "#6b7280", letterSpacing: 0.8 }}>
                  [{{ safe: "SÄKER", playful: "LEKFULL", bold: "DJÄRV" }[s.style as string] ?? s.style.toUpperCase()}]
                </span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{s.confidence}%</span>
              </div>
              <p style={{ fontSize: 12, margin: "0 0 6px", lineHeight: 1.5, color: "#1a1a2e" }}>{s.text}</p>
              <button onClick={() => copyAndFill(s.text, s.style)} style={{ background: "#eff0fe", color: "#6171f1", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {copied === s.style ? "✓ Kopierat!" : "Kopiera & fyll i"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const triggerBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #6171f1, #8b5cf6)",
  color: "white", border: "none", borderRadius: 20,
  padding: "6px 14px", fontSize: 12, fontWeight: 600,
  cursor: "pointer", boxShadow: "0 2px 8px rgba(97,113,241,0.35)",
}

const panelStyle: React.CSSProperties = {
  position: "absolute", bottom: "calc(100% + 8px)", left: 0,
  width: 320, background: "white",
  border: "1px solid #e8e8f0", borderRadius: 14,
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  zIndex: 999999, padding: 12,
  display: "flex", flexDirection: "column", gap: 8,
  fontFamily: "system-ui, sans-serif",
}

import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://bumble.com/*"],
  all_frames: false,
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector(
    "[data-qa='message-editor'], .message-editor__text, textarea[aria-label*='message' i], textarea[placeholder*='message' i], textarea[placeholder*='meddelande' i]"
  ) as Element

function getLastIncomingMessage(): string {
  const msgs = document.querySelectorAll(
    "[data-qa='message-text']:not([data-qa-owner='mine']), .message__body--incoming, [class*='incoming'] [class*='text']"
  )
  if (msgs.length === 0) return ""
  return msgs[msgs.length - 1]?.textContent?.trim() ?? ""
}

function getMatchName(): string {
  return (
    document.querySelector(
      "[data-qa='match-name'], .encounters-story-profile__name, h1[class*='name'], [class*='profile-name']"
    )?.textContent?.trim() ?? "Match"
  )
}

const API_BASE = "https://wingai-umber.vercel.app"

export default function BumbleOverlay() {
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
        body: JSON.stringify({ matchId: "bumble-ext", ownMessage: theirMsg, matchName: getMatchName() }),
      })
      setAnalysis(await res.json())
    } catch {}
    setLoading(false)
  }

  async function copyAndFill(text: string, style: string) {
    await navigator.clipboard.writeText(text)
    setCopied(style)
    const input = document.querySelector<HTMLTextAreaElement>(
      "[data-qa='message-editor'], textarea[aria-label*='message' i]"
    )
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
          <div style={panelHeader}>
            <span>🦋 WingAI · ConvoOS</span>
            <button onClick={() => setOpen(false)} style={closeBtn}>✕</button>
          </div>

          <textarea
            value={theirMsg}
            onChange={e => setTheirMsg(e.target.value)}
            placeholder="Deras senaste meddelande…"
            rows={3}
            style={textareaStyle}
          />

          <button onClick={analyze} disabled={loading || !theirMsg.trim()} style={analyzeBtn(loading || !theirMsg.trim())}>
            {loading ? "Analyserar…" : "Få förslag ↗"}
          </button>

          {analysis?.suggestions?.map((s: any) => (
            <div key={s.style} style={suggestionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: styleColor(s.style), letterSpacing: 0.8 }}>
                  [{styleLabel(s.style)}]
                </span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{s.confidence}%</span>
              </div>
              <p style={{ fontSize: 12, margin: "0 0 6px", lineHeight: 1.5, color: "#1a1a2e" }}>{s.text}</p>
              <button onClick={() => copyAndFill(s.text, s.style)} style={copyBtn}>
                {copied === s.style ? "✓ Kopierat!" : "Kopiera & fyll i"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function styleLabel(s: string) { return { safe: "SÄKER", playful: "LEKFULL", bold: "DJÄRV" }[s] ?? s.toUpperCase() }
function styleColor(s: string) { return { safe: "#6171f1", playful: "#f59e0b", bold: "#f87171" }[s] ?? "#6b7280" }

const triggerBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #6171f1, #8b5cf6)",
  color: "white", border: "none", borderRadius: 20,
  padding: "6px 14px", fontSize: 12, fontWeight: 600,
  cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
  boxShadow: "0 2px 8px rgba(97,113,241,0.35)",
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

const panelHeader: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  fontSize: 12, fontWeight: 700, color: "#6171f1",
}

const closeBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  color: "#9ca3af", fontSize: 14, padding: 0,
}

const textareaStyle: React.CSSProperties = {
  width: "100%", padding: "7px 9px", border: "1px solid #e8e8f0",
  borderRadius: 8, fontSize: 12, resize: "none",
  fontFamily: "inherit", boxSizing: "border-box", outline: "none",
}

const analyzeBtn = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? "#c7c7f0" : "linear-gradient(135deg, #6171f1, #8b5cf6)",
  color: "white", border: "none", borderRadius: 8,
  padding: "8px 0", fontSize: 12, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer", width: "100%",
  fontFamily: "inherit",
})

const suggestionCard: React.CSSProperties = {
  background: "#fafaf9", border: "1px solid #f0f0f8",
  borderRadius: 9, padding: "8px 10px",
}

const copyBtn: React.CSSProperties = {
  background: "#eff0fe", color: "#6171f1", border: "none",
  borderRadius: 6, padding: "3px 10px", fontSize: 11,
  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
}

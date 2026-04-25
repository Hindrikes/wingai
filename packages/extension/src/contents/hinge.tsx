import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState, useRef } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://hinge.co/*"],
  all_frames: false,
}

// ─── Selectors (ordered by specificity — first match wins) ───────────────────
const INPUT_SELECTORS = [
  "[data-testid='send-message-input']",
  "textarea[data-testid*='message']",
  ".conversation-input textarea",
  "textarea[placeholder*='message' i]",
  "textarea[placeholder*='meddelande' i]",
  "[contenteditable='true'][data-placeholder*='message' i]",
  "textarea:not([style*='display:none'])",
]

const RECEIVED_SELECTORS = [
  "[data-testid='received-message'] [data-testid='message-body']",
  "[data-testid='received-message']",
  ".message--received .message__body",
  "[class*='receivedMessage'] [class*='body']",
  "[class*='received'][class*='message']",
  "[class*='message'][class*='incoming']",
]

const NAME_SELECTORS = [
  "[data-testid='match-name']",
  "[data-testid*='profile-name']",
  ".profile-card__name",
  "[class*='matchName']",
  "h1[class*='name' i]",
]

function findFirst(selectors: string[]): Element | null {
  for (const sel of selectors) {
    try { const el = document.querySelector(sel); if (el) return el; } catch {}
  }
  return null
}

function findAll(selectors: string[]): Element[] {
  for (const sel of selectors) {
    try { const els = document.querySelectorAll(sel); if (els.length > 0) return Array.from(els); } catch {}
  }
  return []
}

function getLastIncomingMessage(): string {
  const msgs = findAll(RECEIVED_SELECTORS)
  return msgs[msgs.length - 1]?.textContent?.trim() ?? ""
}

function getMatchName(): string {
  return findFirst(NAME_SELECTORS)?.textContent?.trim() ?? "Match"
}

function fillInput(text: string) {
  const input = findFirst(INPUT_SELECTORS)
  if (!input) return
  if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set
    setter?.call(input, text)
    input.dispatchEvent(new Event("input", { bubbles: true }))
    input.dispatchEvent(new Event("change", { bubbles: true }))
  } else if ((input as HTMLElement).isContentEditable) {
    ;(input as HTMLElement).textContent = text
    input.dispatchEvent(new Event("input", { bubbles: true }))
  }
  ;(input as HTMLElement).focus()
}

const API_BASE = "https://wingai-umber.vercel.app"

export default function HingeOverlay() {
  const [open, setOpen] = useState(false)
  const [theirMsg, setTheirMsg] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [hasInput, setHasInput] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setHasInput(!!findFirst(INPUT_SELECTORS))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (open) {
      const auto = getLastIncomingMessage()
      if (auto) setTheirMsg(auto)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
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
        body: JSON.stringify({ matchId: "hinge-ext", ownMessage: theirMsg, matchName: getMatchName() }),
      })
      setAnalysis(await res.json())
    } catch {}
    setLoading(false)
  }

  async function copyAndFill(text: string, style: string) {
    await navigator.clipboard.writeText(text)
    setCopied(style)
    fillInput(text)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!hasInput) return null

  return (
    <div
      style={{
        position: "fixed", bottom: 80, right: 16, zIndex: 999998,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
      }}
    >
      {open && (
        <div ref={panelRef} style={panelStyle}>
          <div style={panelHeader}>
            <span>🦋 WingAI · Hinge</span>
            <button onClick={() => setOpen(false)} style={closeBtn}>✕</button>
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#8C7B6B" }}>{getMatchName()}</div>
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
              <p style={{ fontSize: 12, margin: "0 0 6px", lineHeight: 1.5, color: "#1C1916" }}>{s.text}</p>
              <button onClick={() => copyAndFill(s.text, s.style)} style={copyBtn}>
                {copied === s.style ? "✓ Kopierat!" : "Kopiera & fyll i"}
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={fabStyle} title="WingAI svarsförslag">
        🦋
      </button>
    </div>
  )
}

function styleLabel(s: string) { return { safe: "SÄKER", playful: "LEKFULL", bold: "DJÄRV" }[s] ?? s.toUpperCase() }
function styleColor(s: string) { return { safe: "#2D4A32", playful: "#92400e", bold: "#C4532A" }[s] ?? "#6b7280" }

const fabStyle: React.CSSProperties = {
  width: 48, height: 48, borderRadius: "50%",
  background: "linear-gradient(135deg, #C4532A, #A84522)",
  border: "none", fontSize: 22, cursor: "pointer",
  boxShadow: "0 4px 16px rgba(196,83,42,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
}

const panelStyle: React.CSSProperties = {
  width: 320, background: "white",
  border: "1px solid #D9CEBC", borderRadius: 14,
  boxShadow: "0 8px 32px rgba(28,25,22,0.15)",
  padding: 12, display: "flex", flexDirection: "column", gap: 8,
  fontFamily: "system-ui, sans-serif",
  maxHeight: "70vh", overflowY: "auto",
}

const panelHeader: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  fontSize: 12, fontWeight: 700, color: "#C4532A",
}

const closeBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  color: "#9ca3af", fontSize: 14, padding: 0,
}

const textareaStyle: React.CSSProperties = {
  width: "100%", padding: "7px 9px", border: "1px solid #D9CEBC",
  borderRadius: 8, fontSize: 12, resize: "none",
  fontFamily: "inherit", boxSizing: "border-box", outline: "none",
  background: "#FAF6F0",
}

const analyzeBtn = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? "#C5B8A6" : "#1C1916",
  color: "#FAF6F0", border: "none", borderRadius: 8,
  padding: "9px 0", fontSize: 12, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer", width: "100%",
  fontFamily: "inherit",
})

const suggestionCard: React.CSSProperties = {
  background: "#FAF6F0", border: "1px solid #EDE4D6",
  borderRadius: 9, padding: "8px 10px",
}

const copyBtn: React.CSSProperties = {
  background: "#1C1916", color: "#FAF6F0", border: "none",
  borderRadius: 6, padding: "4px 10px", fontSize: 11,
  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
}

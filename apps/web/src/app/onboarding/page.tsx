"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function WingLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="9" fill="#C4532A" />
      <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
    </svg>
  );
}

export default function OnboardingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startOnboarding() {
    setStarted(true);
    setLoading(true);
    const res = await fetch("/api/agents/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });
    const data = await res.json();
    setMessages([{ role: "assistant", content: data.text }]);
    setProgress(10);
    setLoading(false);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/agents/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.text }]);
    setProgress((p) => Math.min(p + 15, 90));

    if (data.profile_complete) {
      setProgress(100);
      setDone(true);
      setTimeout(() => router.push("/pipeline"), 2000);
    }
    setLoading(false);
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <WingLogo size={48} />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-ink-900 mb-2">Välkommen till WingAI</h1>
          <p className="text-sand-700 text-sm mb-6">
            Vi tar 5–7 minuter för att förstå din dejtingstil. Ingen blankett — bara ett samtal.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: "🎯", label: "Anknytningsstil" },
              { icon: "💬", label: "Kommunikation" },
              { icon: "🧲", label: "Kemi-match" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-sand-400/60 p-3">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs text-ink-700 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={startOnboarding}
            className="w-full bg-ink-900 text-sand-100 py-3 rounded text-sm font-medium hover:bg-ink-800 transition-colors"
          >
            Starta kartläggning
          </button>
          <Link href="/pipeline" className="block mt-3 text-xs text-sand-700 hover:text-ink-800">
            Hoppa över för nu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-sand-100/90 backdrop-blur-sm border-b border-sand-300 px-4 py-3 flex items-center gap-3 z-10">
        <WingLogo size={22} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-900">UserDNA-kartläggning</span>
            <span className="text-xs text-sand-700">{progress}%</span>
          </div>
          <div className="h-1 bg-sand-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-terra-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-lg mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-ink-900 text-sand-100 rounded-br-sm"
                  : "bg-white border border-sand-400/60 text-ink-900 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-sand-400/60 rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-sand-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {done && (
          <div className="flex justify-center">
            <div className="bg-forest-50 border border-forest-100 rounded-xl px-4 py-3 text-center">
              <div className="text-2xl mb-1">✓</div>
              <p className="text-sm font-medium text-forest-800">Profil klar! Redirectar...</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!done && (
        <div className="sticky bottom-0 bg-sand-100/90 backdrop-blur-sm border-t border-sand-300 p-4">
          <form onSubmit={sendMessage} className="max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv ditt svar..."
              disabled={loading || !started}
              className="flex-1 px-4 py-2.5 rounded border border-sand-400 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500/40 focus:border-terra-500 disabled:opacity-50 bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-ink-900 text-sand-100 px-4 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
            >
              Skicka
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

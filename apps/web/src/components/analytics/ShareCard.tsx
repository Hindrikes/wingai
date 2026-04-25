"use client";

import { useState, useRef } from "react";

interface ShareCardProps {
  total: number;
  contacted: number;
  dating: number;
  avgChemistry: number;
  topStyle: string | null;
}

export function ShareCard({ total, contacted, dating, avgChemistry, topStyle }: ShareCardProps) {
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const winRate = total > 0 ? Math.round((dating / total) * 100) : 0;

  async function handleShare() {
    setSharing(true);
    const text =
      `📊 Min dejtingstatistik denna vecka via WingAI:\n\n` +
      `• ${total} matcher analyserade\n` +
      `• ${contacted} kontaktade\n` +
      `• ${dating} aktiva dates\n` +
      `• ${avgChemistry}% snitt-kemi\n` +
      `• ${winRate}% konverteringsgrad\n` +
      (topStyle ? `• Bästa stil: ${topStyle}\n` : "") +
      `\nTesta själv → wingai-umber.vercel.app`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Min dejtingstatistik — WingAI", text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Kopierat till urklipp!");
    }
    setSharing(false);
  }

  return (
    <div className="bg-white rounded-xl border border-sand-400/60 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif font-semibold text-ink-900">Din dejtingrapport</h2>
          <p className="text-xs text-sand-700 mt-0.5">Dela med vänner</p>
        </div>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 bg-ink-900 text-sand-100 px-4 py-2 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
        >
          <span>↗</span>
          {sharing ? "Delar…" : "Dela statistik"}
        </button>
      </div>

      {/* Visual card */}
      <div
        ref={cardRef}
        className="bg-ink-900 rounded-xl p-5 text-sand-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="9" fill="#C4532A" />
            <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
          </svg>
          <span className="font-semibold text-xs tracking-widest uppercase">WingAI</span>
          <span className="ml-auto text-xs text-sand-500">Dejtingrapport</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/8 rounded-lg px-3 py-2.5">
            <p className="text-xs text-sand-500">Matcher</p>
            <p className="font-serif text-2xl font-semibold">{total}</p>
          </div>
          <div className="bg-white/8 rounded-lg px-3 py-2.5">
            <p className="text-xs text-sand-500">Aktiva dates</p>
            <p className="font-serif text-2xl font-semibold">{dating}</p>
          </div>
          <div className="bg-white/8 rounded-lg px-3 py-2.5">
            <p className="text-xs text-sand-500">Snitt-kemi</p>
            <p className="font-serif text-2xl font-semibold text-terra-400">{avgChemistry}%</p>
          </div>
          <div className="bg-white/8 rounded-lg px-3 py-2.5">
            <p className="text-xs text-sand-500">Konvertering</p>
            <p className="font-serif text-2xl font-semibold">{winRate}%</p>
          </div>
        </div>
        {topStyle && (
          <p className="text-xs text-sand-500 mt-3 text-center">
            Bästa meddelandestil: <span className="font-semibold text-sand-200">{topStyle}</span>
          </p>
        )}
      </div>
    </div>
  );
}

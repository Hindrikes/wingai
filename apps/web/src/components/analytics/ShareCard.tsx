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
    <div className="bg-white rounded-2xl border border-wing-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-medium text-wing-900">Din dejtingrapport</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Dela med vänner</p>
        </div>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 bg-wing-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-50"
        >
          <span>↗</span>
          {sharing ? "Delar…" : "Dela statistik"}
        </button>
      </div>

      {/* Visual card */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-wing-600 to-wing-800 rounded-xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🦋</span>
          <span className="font-bold text-sm tracking-wide">WINGAI</span>
          <span className="ml-auto text-xs opacity-70">Dejtingrapport</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg px-3 py-2.5">
            <p className="text-xs opacity-70">Matcher</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2.5">
            <p className="text-xs opacity-70">Aktiva dates</p>
            <p className="text-2xl font-bold">{dating}</p>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2.5">
            <p className="text-xs opacity-70">Snitt-kemi</p>
            <p className="text-2xl font-bold">{avgChemistry}%</p>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2.5">
            <p className="text-xs opacity-70">Konvertering</p>
            <p className="text-2xl font-bold">{winRate}%</p>
          </div>
        </div>
        {topStyle && (
          <p className="text-xs opacity-70 mt-3 text-center">
            Bästa meddelandestil: <span className="font-semibold opacity-100">{topStyle}</span>
          </p>
        )}
      </div>
    </div>
  );
}

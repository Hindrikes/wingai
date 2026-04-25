"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ConvoOSPanel } from "@/components/convoos/ConvoOSPanel";
import type { MatchCard, ConvoAnalysis } from "@/types";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchCard | null>(null);
  const [myMessage, setMyMessage] = useState("");
  const [analysis, setAnalysis] = useState<ConvoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then((r) => r.json())
      .then((data) => setMatch(data.match))
      .catch(() => {});
  }, [id]);

  async function analyze() {
    if (!myMessage.trim() || !match) return;
    setLoading(true);
    const res = await fetch("/api/agents/convoos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: id, ownMessage: myMessage }),
    });
    const data = await res.json();
    setAnalysis(data);
    setLoading(false);
  }

  if (!match) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-sand-300 rounded w-48" />
          <div className="h-4 bg-sand-300 rounded w-64" />
          <div className="h-64 bg-sand-300 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-5 border-b border-sand-300">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink-900">{match.displayName}</h1>
          <p className="text-sm text-sand-700 mt-0.5">
            {match.platform} · Kemi {match.chemistryScore}% · Lång sikt {match.longtermScore}%
          </p>
        </div>
        <div className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
          match.stage === "date_complete" ? "bg-forest-50 text-forest-700 border border-forest-100" :
          match.stage === "active" ? "bg-sand-200 text-ink-700 border border-sand-400" :
          "bg-sand-200 text-sand-700 border border-sand-300"
        }`}>
          {match.stage}
        </div>
      </div>

      {/* ConvoOS Input */}
      <div className="bg-white rounded-xl border border-sand-400/60 p-5 space-y-4">
        <h2 className="font-serif font-semibold text-ink-900">Deras senaste meddelande</h2>
        <textarea
          value={myMessage}
          onChange={(e) => setMyMessage(e.target.value)}
          placeholder="Klistra in deras senaste meddelande här..."
          rows={3}
          className="w-full px-3 py-2.5 rounded border border-sand-400 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500/40 focus:border-terra-500 resize-none bg-sand-50"
        />
        <button
          onClick={analyze}
          disabled={loading || !myMessage.trim()}
          className="w-full bg-ink-900 text-sand-100 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Analyserar…" : "Få svarsförslag"}
        </button>
      </div>

      {analysis && (
        <ConvoOSPanel
          analysis={analysis}
          matchName={match.displayName}
          loading={loading}
          onRequestSuggestions={analyze}
          onSend={(_msg, _style) => {}}
        />
      )}
    </div>
  );
}

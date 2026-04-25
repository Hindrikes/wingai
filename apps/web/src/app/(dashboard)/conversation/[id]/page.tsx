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
          <div className="h-8 bg-wing-100 rounded-lg w-48" />
          <div className="h-4 bg-wing-100 rounded w-64" />
          <div className="h-64 bg-wing-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-wing-900">{match.matchName}</h1>
          <p className="text-sm text-muted-foreground">
            {match.platform} · Kemi {match.chemistryScore}% · Lång sikt {match.longtermScore}%
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          match.stage === "dating" ? "bg-emerald-100 text-emerald-700" :
          match.stage === "messaging" ? "bg-wing-100 text-wing-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {match.stage}
        </div>
      </div>

      {/* ConvoOS Input */}
      <div className="bg-white rounded-2xl border border-wing-100 p-5 space-y-4">
        <h2 className="font-medium text-wing-900">Deras senaste meddelande</h2>
        <textarea
          value={myMessage}
          onChange={(e) => setMyMessage(e.target.value)}
          placeholder="Klistra in deras senaste meddelande här..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-wing-200 text-sm focus:outline-none focus:ring-2 focus:ring-wing-400 resize-none"
        />
        <button
          onClick={analyze}
          disabled={loading || !myMessage.trim()}
          className="w-full bg-wing-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Analyserar…" : "Få svarsförslag"}
        </button>
      </div>

      {analysis && (
        <ConvoOSPanel analysis={analysis} matchName={match.matchName} />
      )}
    </div>
  );
}

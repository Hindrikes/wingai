"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ConvoAnalysis, MessageSuggestion, MessageStyle } from "@/types";

interface ConvoOSPanelProps {
  matchName: string;
  analysis: ConvoAnalysis | null;
  loading?: boolean;
  onSend: (message: string, style: MessageStyle) => void;
  onRequestSuggestions: () => void;
}

const STYLE_CONFIG: Record<MessageStyle, { label: string; color: string; bg: string }> = {
  safe: {
    label: "SÄKER",
    color: "text-forest-600",
    bg: "bg-forest-50 border-forest-100 hover:border-forest-300",
  },
  playful: {
    label: "LEKFULL",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-100 hover:border-amber-300",
  },
  bold: {
    label: "DJÄRV",
    color: "text-terra-500",
    bg: "bg-terra-50 border-terra-100 hover:border-terra-200",
  },
};

export function ConvoOSPanel({
  matchName,
  analysis,
  loading,
  onSend,
  onRequestSuggestions,
}: ConvoOSPanelProps) {
  const [editingStyle, setEditingStyle] = useState<MessageStyle | null>(null);
  const [editedText, setEditedText] = useState("");
  const [ownMessage, setOwnMessage] = useState("");
  const [showOwnInput, setShowOwnInput] = useState(false);

  function handleEdit(suggestion: MessageSuggestion) {
    setEditingStyle(suggestion.style);
    setEditedText(suggestion.text);
    setShowOwnInput(false);
  }

  function handleSend(text: string, style: MessageStyle) {
    onSend(text, style);
    setEditingStyle(null);
    setEditedText("");
  }

  return (
    <div className="bg-white rounded-xl border border-sand-400/60 shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sand-300">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="9" fill="#C4532A" />
            <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="white" opacity="0.95" />
          </svg>
          <span className="font-serif font-semibold text-ink-900 text-sm">WingAI</span>
          <span className="text-sand-700 text-sm">· {matchName}</span>
        </div>
        <button
          onClick={onRequestSuggestions}
          disabled={loading}
          className="text-xs text-terra-500 font-medium hover:text-terra-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Analyserar…" : "↻ Uppdatera"}
        </button>
      </div>

      {/* Stage insight */}
      {analysis?.stageInsight && (
        <div className="bg-sand-200 rounded px-3 py-2 border border-sand-300">
          <p className="text-xs text-ink-700">{analysis.stageInsight}</p>
          {analysis.optimalAction && (
            <p className="text-xs text-forest-600 font-medium mt-1">
              → {analysis.optimalAction}
            </p>
          )}
        </div>
      )}

      {/* Warning signals */}
      {(analysis?.warningSignals ?? []).length > 0 && (
        <div className="bg-terra-50 border border-terra-100 rounded px-3 py-2">
          {analysis!.warningSignals.map((w) => (
            <p key={w} className="text-xs text-terra-600">
              ⚠ {w}
            </p>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !analysis && (
        <div className="space-y-3">
          {["safe", "playful", "bold"].map((s) => (
            <div key={s} className="bg-sand-200 rounded h-20 animate-pulse" />
          ))}
        </div>
      )}

      {/* Suggestions */}
      {analysis?.suggestions.map((suggestion) => {
        const config = STYLE_CONFIG[suggestion.style];
        const isEditing = editingStyle === suggestion.style;

        return (
          <div
            key={suggestion.style}
            className={cn("rounded border p-3 transition-all", config.bg)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-[10px] font-bold tracking-widest uppercase", config.color)}>
                {config.label}
              </span>
              <span className="text-xs text-sand-700">{suggestion.confidence}%</span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full text-sm text-ink-900 bg-white border border-sand-400 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-terra-500/40"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSend(editedText, suggestion.style)}
                    className="flex-1 text-xs bg-ink-900 text-sand-100 py-1.5 rounded hover:bg-ink-800 transition-colors"
                  >
                    Skicka
                  </button>
                  <button
                    onClick={() => setEditingStyle(null)}
                    className="text-xs text-sand-700 px-3 py-1.5 rounded hover:bg-sand-200 transition-colors"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-ink-900 mb-2 leading-relaxed">{suggestion.text}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSend(suggestion.text, suggestion.style)}
                    className="text-xs text-terra-500 font-medium hover:text-terra-600 transition-colors"
                  >
                    Skicka
                  </button>
                  <button
                    onClick={() => handleEdit(suggestion)}
                    className="text-xs text-sand-700 hover:text-ink-800 transition-colors"
                  >
                    Redigera
                  </button>
                </div>
                <p className="text-xs text-sand-600 mt-2 italic">{suggestion.reasoning}</p>
              </>
            )}
          </div>
        );
      })}

      {/* Write own */}
      <div className="border-t border-sand-300 pt-3">
        {showOwnInput ? (
          <div className="space-y-2">
            <textarea
              value={ownMessage}
              onChange={(e) => setOwnMessage(e.target.value)}
              placeholder="Skriv ditt eget meddelande…"
              className="w-full text-sm text-ink-900 bg-sand-100 border border-sand-400 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-terra-500/40"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSend(ownMessage, "safe")}
                className="flex-1 text-xs bg-ink-900 text-sand-100 py-1.5 rounded hover:bg-ink-800 transition-colors"
              >
                Skicka
              </button>
              <button
                onClick={() => { setShowOwnInput(false); setOwnMessage(""); }}
                className="text-xs text-sand-700 px-3 py-1.5 rounded hover:bg-sand-200 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowOwnInput(true)}
            className="w-full text-xs text-sand-700 hover:text-ink-800 transition-colors text-left"
          >
            ✏ Skriv eget meddelande
          </button>
        )}
      </div>
    </div>
  );
}

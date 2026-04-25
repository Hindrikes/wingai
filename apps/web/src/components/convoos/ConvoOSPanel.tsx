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
    color: "text-wing-600",
    bg: "bg-wing-50 border-wing-100 hover:border-wing-300",
  },
  playful: {
    label: "LEKFULL",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100 hover:border-amber-300",
  },
  bold: {
    label: "DJÄRV",
    color: "text-coral-400",
    bg: "bg-red-50 border-red-100 hover:border-red-200",
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
    <div className="bg-white rounded-2xl border border-wing-100 shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🦋</span>
          <span className="font-semibold text-wing-900 text-sm">WingAI</span>
          <span className="text-muted-foreground text-sm">· {matchName}</span>
        </div>
        <button
          onClick={onRequestSuggestions}
          disabled={loading}
          className="text-xs text-wing-600 font-medium hover:text-wing-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Analyserar…" : "↻ Uppdatera"}
        </button>
      </div>

      {/* Stage insight */}
      {analysis?.stageInsight && (
        <div className="bg-wing-50 rounded-lg px-3 py-2">
          <p className="text-xs text-wing-700">{analysis.stageInsight}</p>
          {analysis.optimalAction && (
            <p className="text-xs text-wing-600 font-medium mt-1">
              💡 {analysis.optimalAction}
            </p>
          )}
        </div>
      )}

      {/* Warning signals */}
      {(analysis?.warningSignals ?? []).length > 0 && (
        <div className="bg-yellow-50 rounded-lg px-3 py-2">
          {analysis!.warningSignals.map((w) => (
            <p key={w} className="text-xs text-yellow-700">
              ⚠ {w}
            </p>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {loading && !analysis && (
        <div className="space-y-3">
          {["safe", "playful", "bold"].map((s) => (
            <div key={s} className="bg-wing-50 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      )}

      {analysis?.suggestions.map((suggestion) => {
        const config = STYLE_CONFIG[suggestion.style];
        const isEditing = editingStyle === suggestion.style;

        return (
          <div
            key={suggestion.style}
            className={cn(
              "rounded-xl border p-3 transition-all",
              config.bg
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-xs font-bold tracking-wide", config.color)}>
                [{config.label}]
              </span>
              <span className="text-xs text-muted-foreground">
                {suggestion.confidence}%
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full text-sm text-wing-900 bg-white border border-wing-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-wing-400"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSend(editedText, suggestion.style)}
                    className="flex-1 text-xs bg-wing-600 text-white py-1.5 rounded-lg hover:bg-wing-700 transition-colors"
                  >
                    ★ Skicka
                  </button>
                  <button
                    onClick={() => setEditingStyle(null)}
                    className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-wing-100 transition-colors"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-wing-900 mb-2 leading-relaxed">
                  {suggestion.text}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSend(suggestion.text, suggestion.style)}
                    className="text-xs text-wing-600 font-medium hover:text-wing-700 transition-colors"
                  >
                    ★ Skicka
                  </button>
                  <button
                    onClick={() => handleEdit(suggestion)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✎ Redigera
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {suggestion.reasoning}
                </p>
              </>
            )}
          </div>
        );
      })}

      {/* Write own message */}
      <div className="border-t border-wing-50 pt-3">
        {showOwnInput ? (
          <div className="space-y-2">
            <textarea
              value={ownMessage}
              onChange={(e) => setOwnMessage(e.target.value)}
              placeholder="Skriv ditt eget meddelande…"
              className="w-full text-sm text-wing-900 bg-wing-50 border border-wing-100 rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-wing-400"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSend(ownMessage, "safe")}
                className="flex-1 text-xs bg-wing-600 text-white py-1.5 rounded-lg hover:bg-wing-700 transition-colors"
              >
                Skicka
              </button>
              <button
                onClick={() => { setShowOwnInput(false); setOwnMessage(""); }}
                className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-wing-100 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowOwnInput(true)}
            className="w-full text-xs text-muted-foreground hover:text-wing-700 transition-colors text-left"
          >
            ✏️ Skriv eget meddelande
          </button>
        )}
      </div>
    </div>
  );
}

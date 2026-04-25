"use client";

import { cn, formatScore, getScoreColor, getMomentumIcon, timeAgo } from "@/lib/utils";
import type { MatchCard as MatchCardType } from "@/types";

interface MatchCardProps {
  match: MatchCardType;
  onAction?: (matchId: string, action: string) => void;
  compact?: boolean;
}

export function MatchCard({ match, onAction, compact = false }: MatchCardProps) {
  const riskLow = match.riskScore < 30;
  const riskMed = match.riskScore >= 30 && match.riskScore < 60;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-wing-100 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-wing-900 text-sm">
            {match.displayName}
            {match.age && (
              <span className="text-muted-foreground font-normal">, {match.age}</span>
            )}
          </h3>
          {(match.occupation || match.location) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {[match.occupation, match.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {match.conversationMomentum && (
            <span
              className={cn(
                "text-xs font-medium",
                match.conversationMomentum === "rising" && "text-sage-500",
                match.conversationMomentum === "falling" && "text-coral-400",
                match.conversationMomentum === "stalled" && "text-yellow-500",
                match.conversationMomentum === "stable" && "text-muted-foreground"
              )}
            >
              {getMomentumIcon(match.conversationMomentum)}
            </span>
          )}
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <ScorePill
          label="⚡ Kemikemi"
          score={match.chemistryScore}
        />
        <ScorePill
          label="♾ Lång­sikt"
          score={match.longtermScore}
        />
      </div>

      {/* Risk indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Risk:</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            riskLow && "bg-sage-400/10 text-sage-500",
            riskMed && "bg-yellow-50 text-yellow-600",
            !riskLow && !riskMed && "bg-coral-400/10 text-coral-400"
          )}
        >
          {riskLow ? "Låg" : riskMed ? "Medium" : "Hög"} ({match.riskScore}%)
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          ROI: <span className="font-medium text-wing-700">{roiLabel(match.effortRoi)}</span>
        </span>
      </div>

      {/* Green flags */}
      {!compact && match.greenFlags.length > 0 && (
        <div className="mb-3">
          {match.greenFlags.slice(0, 2).map((flag) => (
            <div key={flag} className="flex items-start gap-1.5 text-xs text-muted-foreground mb-1">
              <span className="text-sage-500 mt-0.5">✓</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI explanation (condensed) */}
      {!compact && match.compatibilityExplanation && (
        <p className="text-xs text-muted-foreground italic border-t border-wing-50 pt-3 mb-3 leading-relaxed">
          {match.compatibilityExplanation.length > 120
            ? match.compatibilityExplanation.slice(0, 120) + "…"
            : match.compatibilityExplanation}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {match.lastMessageAt && (
          <span className="text-xs text-muted-foreground">
            {timeAgo(match.lastMessageAt)}
          </span>
        )}
        {match.nextRecommendedAction && (
          <button
            onClick={() => onAction?.(match.id, match.nextRecommendedAction!)}
            className="text-xs text-wing-600 font-medium hover:text-wing-700 transition-colors ml-auto"
          >
            💡 {match.nextRecommendedAction}
          </button>
        )}
      </div>
    </div>
  );
}

function ScorePill({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-wing-50 rounded-lg px-2.5 py-1.5">
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className={cn("text-sm font-semibold", getScoreColor(score))}>
        {formatScore(score)}
      </div>
    </div>
  );
}

function roiLabel(roi: string): string {
  const labels: Record<string, string> = {
    very_high: "Mycket hög",
    high: "Hög",
    medium: "Medium",
    low: "Låg",
  };
  return labels[roi] ?? roi;
}

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
        "bg-white rounded-xl border border-sand-400/60 hover:border-sand-500 hover:shadow-md transition-all duration-200 animate-fade-in relative",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif font-semibold text-ink-900 text-base leading-tight">
            {match.displayName}
            {match.age && (
              <span className="text-sand-700 font-sans font-normal text-sm">, {match.age}</span>
            )}
          </h3>
          {(match.occupation || match.location) && (
            <p className="text-xs text-sand-700 mt-0.5">
              {[match.occupation, match.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {match.conversationMomentum && (
          <span
            className={cn(
              "text-sm mt-0.5",
              match.conversationMomentum === "rising" && "text-forest-600",
              match.conversationMomentum === "falling" && "text-terra-500",
              match.conversationMomentum === "stalled" && "text-sand-600",
              match.conversationMomentum === "stable" && "text-sand-700"
            )}
          >
            {getMomentumIcon(match.conversationMomentum)}
          </span>
        )}
      </div>

      {/* Score bars */}
      <div className="space-y-2 mb-3">
        <ScoreBar label="Kemi" score={match.chemistryScore} accent="terra" />
        <ScoreBar label="Långsikt" score={match.longtermScore} accent="forest" />
      </div>

      {/* Risk */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-sand-700">Risk</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded",
            riskLow && "bg-forest-50 text-forest-600 border border-forest-100",
            riskMed && "bg-sand-200 text-sand-800 border border-sand-400",
            !riskLow && !riskMed && "bg-terra-50 text-terra-500 border border-terra-100"
          )}
        >
          {riskLow ? "Låg" : riskMed ? "Medium" : "Hög"} ({match.riskScore}%)
        </span>
        <span className="text-xs text-sand-700 ml-auto">
          ROI: <span className="font-medium text-ink-700">{roiLabel(match.effortRoi)}</span>
        </span>
      </div>

      {/* Green flags */}
      {!compact && (match.greenFlags?.length ?? 0) > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(match.greenFlags ?? []).slice(0, 3).map((flag) => (
            <span key={flag} className="text-xs px-2 py-0.5 rounded bg-sand-200 text-ink-700 border border-sand-300">
              {flag}
            </span>
          ))}
        </div>
      )}

      {/* AI explanation */}
      {!compact && match.compatibilityExplanation && (
        <p className="text-xs text-sand-700 italic border-t border-sand-300 pt-3 mb-3 leading-relaxed">
          {match.compatibilityExplanation.length > 120
            ? match.compatibilityExplanation.slice(0, 120) + "…"
            : match.compatibilityExplanation}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {match.lastMessageAt && (
          <span className="text-xs text-sand-600">{timeAgo(match.lastMessageAt)}</span>
        )}
        {match.nextRecommendedAction && (
          <button
            onClick={() => onAction?.(match.id, match.nextRecommendedAction!)}
            className="text-xs text-forest-600 font-medium hover:text-forest-700 transition-colors ml-auto flex items-center gap-1"
          >
            → {match.nextRecommendedAction}
          </button>
        )}
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  accent,
}: {
  label: string;
  score: number;
  accent: "terra" | "forest";
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-sand-600">{label}</span>
        <span className="text-[10px] font-semibold text-ink-700">{formatScore(score)}</span>
      </div>
      <div className="h-1 bg-sand-300 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", accent === "terra" ? "bg-terra-500" : "bg-forest-600")}
          style={{ width: `${score}%` }}
        />
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

"use client";

import { useState } from "react";
import { MatchCard } from "@/components/match-card/MatchCard";
import { cn, getStageLabel } from "@/lib/utils";
import type { MatchCard as MatchCardType, PipelineStage } from "@/types";

const STAGES: PipelineStage[] = [
  "matched",
  "active",
  "date_scheduled",
  "date_complete",
];

interface DateFlowPipelineProps {
  matches: MatchCardType[];
  onMatchAction?: (matchId: string, action: string) => void;
}

export function DateFlowPipeline({ matches, onMatchAction }: DateFlowPipelineProps) {
  const [activeStage, setActiveStage] = useState<PipelineStage | "all">("all");

  const filteredMatches =
    activeStage === "all"
      ? matches
      : matches.filter((m) => m.stage === activeStage);

  const countByStage = (stage: PipelineStage) =>
    matches.filter((m) => m.stage === stage).length;

  return (
    <div className="space-y-5">
      {/* Stage filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <StageTab
          label="Alla"
          count={matches.length}
          active={activeStage === "all"}
          onClick={() => setActiveStage("all")}
        />
        {STAGES.map((stage) => (
          <StageTab
            key={stage}
            label={getStageLabel(stage)}
            count={countByStage(stage)}
            active={activeStage === stage}
            onClick={() => setActiveStage(stage)}
          />
        ))}
      </div>

      {/* Match cards grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 text-sand-700">
          <div className="mb-4 flex justify-center">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
              <path d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z" fill="#8C7B6B"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-ink-700">Inga matcher i det här stadiet ännu.</p>
          <p className="text-xs mt-1 text-sand-700">
            Importera en profil via skärmdump för att komma igång.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onAction={onMatchAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StageTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all",
        active
          ? "bg-ink-900 text-sand-100"
          : "bg-white text-sand-700 border border-sand-400 hover:border-ink-400 hover:text-ink-800"
      )}
    >
      {label}
      <span
        className={cn(
          "text-[10px] px-1.5 py-0.5 rounded",
          active ? "bg-white/15 text-sand-200" : "bg-sand-300 text-sand-800"
        )}
      >
        {count}
      </span>
    </button>
  );
}

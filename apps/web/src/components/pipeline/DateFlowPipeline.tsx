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
    <div className="space-y-4">
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
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-3xl mb-2">🦋</div>
          <p className="text-sm">Inga matcher i det här stadiet ännu.</p>
          <p className="text-xs mt-1">
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
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-wing-600 text-white"
          : "bg-wing-50 text-wing-700 hover:bg-wing-100"
      )}
    >
      {label}
      <span
        className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          active ? "bg-white/20 text-white" : "bg-wing-200 text-wing-700"
        )}
      >
        {count}
      </span>
    </button>
  );
}

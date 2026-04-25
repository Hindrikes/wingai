import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-sage-500";
  if (score >= 50) return "text-yellow-500";
  return "text-coral-400";
}

export function getMomentumIcon(momentum: string | null): string {
  switch (momentum) {
    case "rising": return "▲";
    case "stable": return "─";
    case "falling": return "▼";
    case "stalled": return "⚠";
    default: return "─";
  }
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    hinge: "Hinge",
    tinder: "Tinder",
    bumble: "Bumble",
    badoo: "Badoo",
    happn: "Happn",
    other: "Annat",
  };
  return labels[platform] ?? platform;
}

export function getStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    discovered: "Hittad",
    matched: "Matchad",
    active: "Aktiv",
    date_scheduled: "Date satt",
    date_complete: "Date klart",
    closed: "Stängd",
  };
  return labels[stage] ?? stage;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return "Just nu";
  if (diffH < 24) return `${diffH}h sedan`;
  if (diffD < 7) return `${diffD}d sedan`;
  return date.toLocaleDateString("sv-SE");
}

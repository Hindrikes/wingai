// ─── UserDNA ───────────────────────────────────────────────────────────────

export type AttachmentStyle = "secure" | "anxious" | "avoidant" | "disorganized";
export type LoveLanguage =
  | "words_of_affirmation"
  | "quality_time"
  | "physical_touch"
  | "acts_of_service"
  | "gifts";
export type HumorRegister = "dry_ironic" | "warm_wholesome" | "wordplay" | "absurdist" | "self_deprecating";

export interface UserDNA {
  id: string;
  userId: string;
  attachmentStyle: AttachmentStyle | null;
  loveLanguages: LoveLanguage[];
  humorRegister: HumorRegister | null;
  avgMessageLength: number;
  emojiDensity: "none" | "rare" | "moderate" | "frequent";
  openerStyle: "observation" | "question" | "compliment" | "humor";
  voiceBaselineEmbedding: number[] | null;
  hardDealbreakers: string[];
  softDealbreakers: string[];
  lifestyleVectors: Record<string, number>; // -1 to 1, 27 dimensions
  statedPreferences: Record<string, unknown>;
  updatedAt: string;
}

// ─── Match / Pipeline ──────────────────────────────────────────────────────

export type PipelineStage =
  | "discovered"
  | "matched"
  | "active"
  | "date_scheduled"
  | "date_complete"
  | "closed";

export type EffortROI = "very_high" | "high" | "medium" | "low";

export interface MatchCard {
  id: string;
  userId: string;
  platform: "hinge" | "tinder" | "bumble" | "badoo" | "happn" | "other";
  platformMatchId: string;
  displayName: string;
  age: number | null;
  occupation: string | null;
  location: string | null;
  // Scores
  chemistryScore: number; // 0–100
  longtermScore: number; // 0–100
  riskScore: number; // 0–100
  effortRoi: EffortROI;
  // Analysis
  greenFlags: string[];
  redFlags: string[];
  personalitySignals: Record<string, unknown>;
  visualSignals: Record<string, unknown>;
  compatibilityExplanation: string;
  // Pipeline
  stage: PipelineStage;
  conversationMomentum: "rising" | "stable" | "falling" | "stalled" | null;
  lastMessageAt: string | null;
  nextRecommendedAction: string | null;
  // Meta
  createdAt: string;
  updatedAt: string;
}

// ─── ConvoOS ──────────────────────────────────────────────────────────────

export type MessageStyle = "safe" | "playful" | "bold";
export type ConversationStage =
  | "opening"
  | "building_rapport"
  | "deepening"
  | "date_proposal"
  | "post_date";

export interface MessageSuggestion {
  style: MessageStyle;
  text: string;
  confidence: number; // 0–100
  tone: string;
  reasoning: string;
}

export interface ConvoAnalysis {
  stage: ConversationStage;
  momentumScore: number;
  suggestions: MessageSuggestion[];
  stageInsight: string;
  warningSignals: string[];
  optimalAction: string | null;
}

// ─── Conversation Outcome ─────────────────────────────────────────────────

export interface ConversationOutcome {
  id: string;
  matchCardId: string;
  messageType: "ai_suggested" | "ai_edited" | "user_written";
  styleUsed: MessageStyle | null;
  responseReceived: boolean;
  responseLatencyHours: number | null;
  responseQualityScore: number | null;
  dateBooked: boolean;
  createdAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────

export interface WeeklyReport {
  weekStart: string;
  newMatches: number;
  conversationsStarted: number;
  activeConversations: number;
  datesBooked: number;
  platformBreakdown: Record<string, { matches: number; dates: number }>;
  bestPerformingStyle: MessageStyle;
  aiSuggestionAcceptanceRate: number;
  voiceAlignmentScore: number;
}

// ─── API Responses ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

import Anthropic from "@anthropic-ai/sdk";

// Singleton Anthropic-klient
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Modellkonstanter
export const MODELS = {
  ORCHESTRATOR: "claude-sonnet-4-6",
  PROFILE_XRAY: "claude-sonnet-4-6",  // vision-kapabel
  CONVOOS_FAST: "claude-haiku-4-5-20251001",
  CONVOOS_COMPLEX: "claude-sonnet-4-6",
  STRATEGY: "claude-opus-4-7",
  SAFETY: "claude-haiku-4-5-20251001",
} as const;

// Hjälpfunktion för att bygga cachat kontext-block
export function buildCachedContext(text: string): Anthropic.TextBlockParam & { cache_control: { type: "ephemeral" } } {
  return {
    type: "text",
    text,
    cache_control: { type: "ephemeral" },
  };
}

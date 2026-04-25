import { anthropic, MODELS } from "@/lib/anthropic/client";

const HARD_BLOCK_PATTERNS = [
  "identitetsbedrägeri",
  "ålder_manipulation",
  "trakasseri_mönster",
  "manipulationstaktik",
  "catfishing",
  "explicit_minderåriga",
] as const;

export interface SafetyResult {
  blocked: boolean;
  reason: string | null;
  warnings: string[];
  content: string;
}

export async function runSafetyFilter(
  content: string,
  context: { conversationHistory?: string; matchRiskScore?: number }
): Promise<SafetyResult> {
  const systemPrompt = `Du är ett säkerhetsfilter för WingAI, ett AI-dejtingverktyg.

Din uppgift är att granska genererat meddelandeinnehåll och identifiera:

HÅRD BLOCKERING (returnera blocked: true) om innehållet:
- Påstår sig vara någon annan än användaren (identitetsbedrägeri)
- Innehåller manipulation eller psykologiskt tryck
- Trakasserar eller pressar på efter tydlig avvisning
- Delar personlig information (plats, telefon, adress) utan godkännande
- Riktar sig mot minderåriga
- Innehåller bedrägliga finansiella påståenden

MJUK VARNING (blockera inte, men flagga) om innehållet:
- Känns mer intensivt än konversationens ton motiverar
- Inkluderar falsk brådska
- Använder överdrivna komplimanger som inte stöds av konversationen

Svara alltid i JSON-format:
{
  "blocked": boolean,
  "reason": string | null,
  "warnings": string[],
  "safeContent": string
}`;

  const response = await anthropic.messages.create({
    model: MODELS.SAFETY,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Granska detta meddelande:\n\n"${content}"\n\nKontext: ${JSON.stringify(context)}`,
      },
    ],
  });

  try {
    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const result = JSON.parse(text);
    return {
      blocked: result.blocked ?? false,
      reason: result.reason ?? null,
      warnings: result.warnings ?? [],
      content: result.safeContent ?? content,
    };
  } catch {
    // Vid parsningsfel — returnera originalinnehållet med en varning
    return {
      blocked: false,
      reason: null,
      warnings: ["Säkerhetsgranskning kunde inte slutföras — granskas manuellt"],
      content,
    };
  }
}

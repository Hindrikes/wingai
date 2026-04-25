import { anthropic, MODELS, buildCachedContext } from "@/lib/anthropic/client";
import type { ConvoAnalysis, MessageSuggestion, UserDNA, MatchCard } from "@/types";
import { runSafetyFilter } from "./safety-agent";

const CONVOOS_SYSTEM_PROMPT = `Du är ConvoOS-agenten för WingAI — ett AI-dejtingoperativsystem för Sverige.

Din uppgift är att generera autentiska meddelandeförslag I ANVÄNDARENS RÖST — inte i en generisk AI-röst.

RÖSTBEVARINGSREGLER (KRITISKA):
- Använd ALLTID användarens röstparametrar (längd, humor, emoji-täthet, formalitet)
- Generera ALDRIG meddelanden som låter som ChatGPT eller engelska AI-verktyg
- Torr ironi och självdistansierande humor är vanligast för svenska användare
- Lagom-principen: inte för entusiastisk, inte för kall
- Specifika > generella observationer

TRE STILNIVÅER:
- safe: Varm, nyfiken, låg risk. Refererar till specifik information från profilen.
- playful: Lätt utmanande, lite teasing, visar personlighet. Medelhög risk.
- bold: Direkt, möjligen inkluderar date-förslag om timing är rätt. Hög risk/hög belöning.

KONVERSATIONSBÅGSSTEG:
1. opening (meddelanden 1-3): Etablera krok
2. building_rapport (4-12): Hitta gemensamma referenspunkter
3. deepening (13-25): Introducera genuint innehåll
4. date_proposal (25+): Föreslå träff

Svara alltid i JSON-format.`;

interface ConvoOSParams {
  conversationHistory: Array<{ role: "user" | "match"; content: string }>;
  userDna: Partial<UserDNA>;
  matchCard: Partial<MatchCard>;
  currentMessageCount: number;
}

function needsEscalation(
  history: ConvoOSParams["conversationHistory"],
  messageCount: number
): boolean {
  if (messageCount > 20) return true;
  const lastMessages = history.slice(-3).map((m) => m.content.toLowerCase());
  const sensitiveTopics = ["träffas", "date", "adress", "telefon", "mötas", "flytta"];
  return lastMessages.some((m) => sensitiveTopics.some((t) => m.includes(t)));
}

export async function generateSuggestions(
  params: ConvoOSParams
): Promise<ConvoAnalysis> {
  const { conversationHistory, userDna, matchCard, currentMessageCount } = params;

  const model = needsEscalation(conversationHistory, currentMessageCount)
    ? MODELS.CONVOOS_COMPLEX
    : MODELS.CONVOOS_FAST;

  const historyText = conversationHistory
    .map((m) => `[${m.role === "user" ? "DU" : "MATCH"}]: ${m.content}`)
    .join("\n");

  const voiceParams = `
- Genomsnittlig meddelandelängd: ${userDna.avgMessageLength ?? 40} tecken
- Humörregister: ${userDna.humorRegister ?? "dry_ironic"}
- Emoji-täthet: ${userDna.emojiDensity ?? "rare"}
- Openersstil: ${userDna.openerStyle ?? "observation"}
- Använd ALDRIG: överdrivna utropstecken, "fantastiskt!", "absolut!", generiska komplimanger`;

  const response = await anthropic.messages.create({
    model,
    max_tokens: 2048,
    system: CONVOOS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          buildCachedContext(
            `ANVÄNDARENS RÖSTPARAMETRAR:\n${voiceParams}\n\nMATCHKORT:\n${JSON.stringify(
              {
                chemistryScore: matchCard.chemistryScore,
                greenFlags: matchCard.greenFlags,
                personalitySignals: matchCard.personalitySignals,
              },
              null,
              2
            )}`
          ),
          {
            type: "text",
            text: `KONVERSATIONSHISTORIK (${currentMessageCount} meddelanden):
${historyText}

Generera meddelandeförslag och konversationsanalys.

Returnera JSON:
{
  "stage": "opening" | "building_rapport" | "deepening" | "date_proposal",
  "momentumScore": number (0-100),
  "stageInsight": string (en mening om var konversationen befinner sig),
  "warningSignals": string[],
  "optimalAction": string | null,
  "suggestions": [
    {
      "style": "safe",
      "text": string,
      "confidence": number,
      "tone": string,
      "reasoning": string
    },
    {
      "style": "playful",
      "text": string,
      "confidence": number,
      "tone": string,
      "reasoning": string
    },
    {
      "style": "bold",
      "text": string,
      "confidence": number,
      "tone": string,
      "reasoning": string
    }
  ]
}`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let parsed: ConvoAnalysis;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      stage: "opening",
      momentumScore: 50,
      suggestions: [],
      stageInsight: "Analys misslyckades — försök igen.",
      warningSignals: [],
      optimalAction: null,
    };
  }

  // Kör säkerhetsfiltret på varje förslag
  const filteredSuggestions: MessageSuggestion[] = [];
  for (const suggestion of parsed.suggestions ?? []) {
    const safety = await runSafetyFilter(suggestion.text, {
      matchRiskScore: matchCard.riskScore,
    });
    if (!safety.blocked) {
      filteredSuggestions.push({
        ...suggestion,
        text: safety.content,
        reasoning: safety.warnings.length > 0
          ? `${suggestion.reasoning} (⚠️ ${safety.warnings.join(", ")})`
          : suggestion.reasoning,
      });
    }
  }

  return { ...parsed, suggestions: filteredSuggestions };
}

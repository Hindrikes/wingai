import { anthropic, MODELS, buildCachedContext } from "@/lib/anthropic/client";
import type { UserDNA } from "@/types";

const USERDNA_SYSTEM_PROMPT = `Du är UserDNA-agenten för WingAI — ett AI-dejtingoperativsystem för den svenska marknaden.

Din uppgift är att förstå, underhålla och uppdatera en djup psykologisk och preferensprofil för användaren.

Du analyserar:
- Kommunikationsstil (meddelandelängd, humor, emoji-användning, openersstil)
- Anknytningsstil (trygg/ängslig/undvikande/desorganiserad)
- Kärleksspråk och värderingar
- Dealbreakers (hårda och mjuka)
- Livsstilsvektorer (27 dimensioner från nattmänniska/morgonmänniska till resefrekvens)
- Uttalade vs. avslöjade preferenser (delta-modell)

VIKTIGT: Svenska kulturella normer gäller:
- Kortare meddelanden är normen
- Torr ironi och självdistansierande humor är vanligast
- Lagom-principen: inte för intensiv, inte för kall
- Direkthet uppskattas i date-förslag

Svara alltid strukturerat i JSON-format.`;

interface ExtractVoiceParams {
  messages: string[];
  existingProfile?: Partial<UserDNA>;
}

export interface VoiceProfile {
  avgMessageLength: number;
  humorRegister: UserDNA["humorRegister"];
  emojiDensity: UserDNA["emojiDensity"];
  openerStyle: UserDNA["openerStyle"];
  vocabularyGradeLevel: number;
  formalityIndex: number;
  characteristicPhrases: string[];
  summary: string;
}

export async function extractVoiceProfile({
  messages,
  existingProfile,
}: ExtractVoiceParams): Promise<VoiceProfile> {
  const avgLength =
    messages.reduce((sum, m) => sum + m.length, 0) / messages.length;

  const response = await anthropic.messages.create({
    model: MODELS.ORCHESTRATOR,
    max_tokens: 2048,
    system: USERDNA_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          buildCachedContext(
            existingProfile
              ? `Befintlig profil: ${JSON.stringify(existingProfile)}`
              : "Ingen befintlig profil — bygg från grunden."
          ),
          {
            type: "text",
            text: `Analysera dessa meddelanden som användaren skrivit och extrahera röstprofilen:

${messages.map((m, i) => `[${i + 1}] "${m}"`).join("\n")}

Genomsnittlig meddelandelängd: ${Math.round(avgLength)} tecken

Returnera JSON med dessa fält:
{
  "avgMessageLength": number,
  "humorRegister": "dry_ironic" | "warm_wholesome" | "wordplay" | "absurdist" | "self_deprecating",
  "emojiDensity": "none" | "rare" | "moderate" | "frequent",
  "openerStyle": "observation" | "question" | "compliment" | "humor",
  "vocabularyGradeLevel": number (1-16),
  "formalityIndex": number (0-1, där 0=mycket informellt, 1=formellt),
  "characteristicPhrases": string[],
  "summary": string (en mening om denna persons kommunikationsstil)
}`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    return JSON.parse(text);
  } catch {
    return {
      avgMessageLength: Math.round(avgLength),
      humorRegister: "dry_ironic",
      emojiDensity: "rare",
      openerStyle: "observation",
      vocabularyGradeLevel: 11,
      formalityIndex: 0.3,
      characteristicPhrases: [],
      summary: "Kommunikationsstil kunde inte analyseras automatiskt.",
    };
  }
}

interface OnboardingAnalysisParams {
  answers: Record<string, string>;
  voiceProfile: VoiceProfile;
}

export async function analyzeOnboarding({
  answers,
  voiceProfile,
}: OnboardingAnalysisParams): Promise<Partial<UserDNA>> {
  const response = await anthropic.messages.create({
    model: MODELS.ORCHESTRATOR,
    max_tokens: 3000,
    system: USERDNA_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analysera dessa onboarding-svar och skapa en UserDNA-profil:

SVAR:
${Object.entries(answers)
  .map(([q, a]) => `Q: ${q}\nA: ${a}`)
  .join("\n\n")}

RÖSTPROFIL (redan analyserad):
${JSON.stringify(voiceProfile, null, 2)}

Returnera JSON med UserDNA-fält inklusive:
- attachmentStyle
- loveLanguages (array)
- hardDealbreakers (array av strängar)
- softDealbreakers (array av strängar)
- lifestyleVectors (objekt med 27 dimensioner, värden -1 till 1)
- statedPreferences (vad de uttryckligen sa sig vilja ha)`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

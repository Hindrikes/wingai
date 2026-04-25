import { anthropic, MODELS, buildCachedContext } from "@/lib/anthropic/client";
import type { MatchCard, UserDNA } from "@/types";

const PROFILEXRAY_SYSTEM_PROMPT = `Du är ProfileX-Ray-agenten för WingAI.

Din uppgift är att analysera dejtingprofiler och producera ett Matchintelligenskort.

Du analyserar:
1. VISUELLA SIGNALER: fotokvalitet, livsstilsinferenser, autenticitetsindikatorer
2. TEXT & BIO: personlighetsextraktion (Big Five), röd/grön flagga-detektion, humörregister
3. KOMPATIBILITET: matching mot användarens UserDNA på fyra dimensioner

FYRA POÄNGDIMENSIONER:
- chemistryScore (0-100): Konversationsspark-potential, humörmatchning, kommunikationsstilkompatibilitet
- longtermScore (0-100): Värdejustering, livsstilskompatibilitet, anknytningsstilmatchning
- riskScore (0-100): Rödflaggor, inkonsekvenser, catfishing-indikatorer (100 = hög risk)
- effortRoi: "very_high" | "high" | "medium" | "low" — uppskattad konverteringspotential vs. insats

SVENSKA KULTURELLA KONTEXTMARKÖRER att känna igen:
- Friluftsliv-bilder (vandring, kayak, skidåkning) = stark nordisk livsstilsindikator
- Specifika svenska referenser > generella
- Torr ironi i bio = positivt kompatibilitetssignal för de flesta svenska användare
- Defensiva markörer ("inga drama", "inte som alla andra") = gult flag

Svara alltid i JSON-format.`;

interface ProfileData {
  displayName: string;
  age?: number;
  occupation?: string;
  location?: string;
  bio: string;
  prompts?: Array<{ question: string; answer: string }>;
  photoDescriptions?: string[]; // beskrivningar av foton, inte råbilder från tredje part
}

export async function analyzeProfile(
  profile: ProfileData,
  userDna: Partial<UserDNA>
): Promise<Partial<MatchCard>> {
  const response = await anthropic.messages.create({
    model: MODELS.PROFILE_XRAY,
    max_tokens: 3000,
    system: PROFILEXRAY_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          buildCachedContext(
            `ANVÄNDARENS UserDNA (för kompatibilitetsberäkning):\n${JSON.stringify(userDna, null, 2)}`
          ),
          {
            type: "text",
            text: `Analysera denna profil och returnera ett Matchintelligenskort:

PROFIL:
Namn: ${profile.displayName}
Ålder: ${profile.age ?? "okänd"}
Yrke: ${profile.occupation ?? "ej angivet"}
Plats: ${profile.location ?? "ej angivet"}
Bio: "${profile.bio}"
${
  profile.prompts?.length
    ? `\nPrompts:\n${profile.prompts.map((p) => `Q: ${p.question}\nA: ${p.answer}`).join("\n\n")}`
    : ""
}
${
  profile.photoDescriptions?.length
    ? `\nFotobeskrivningar:\n${profile.photoDescriptions.map((d, i) => `Foto ${i + 1}: ${d}`).join("\n")}`
    : ""
}

Returnera JSON:
{
  "chemistryScore": number,
  "longtermScore": number,
  "riskScore": number,
  "effortRoi": "very_high" | "high" | "medium" | "low",
  "greenFlags": string[],
  "redFlags": string[],
  "personalitySignals": {
    "openness": number,
    "conscientiousness": number,
    "extraversion": number,
    "agreeableness": number,
    "neuroticism": number,
    "humorRegister": string,
    "ambitionLevel": string
  },
  "compatibilityExplanation": string,
  "suggestedOpenerAngle": string,
  "nextRecommendedAction": string
}`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      displayName: profile.displayName,
      age: profile.age ?? null,
      occupation: profile.occupation ?? null,
      location: profile.location ?? null,
    };
  } catch {
    return {
      chemistryScore: 50,
      longtermScore: 50,
      riskScore: 20,
      effortRoi: "medium",
      greenFlags: [],
      redFlags: [],
      compatibilityExplanation: "Analys misslyckades — försök igen.",
      nextRecommendedAction: "Granska profilen manuellt",
    };
  }
}

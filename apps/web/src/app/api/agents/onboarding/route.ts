import { createClient } from "@/lib/supabase/server";
import { anthropic, MODELS } from "@/lib/anthropic/client";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Du är en empatisk och insiktsfull personlighetskonsult som hjälper användare att förstå sin dejtingstil. Du för ett naturligt samtal på svenska för att kartlägga:

1. Anknytningsstil (trygg/ängslig/undvikande/desorganiserad)
2. Kärleksspråk (bekräftelse, kvalitetstid, gåvor, tjänster, fysisk beröring)
3. Humorregister (torr ironi, värme, sarkasm, lekfull)
4. Kommunikationsstil (medellång meddelandelängd, emojitäthet, openerpreferens)
5. Dealbreakers och livsstilsvektorer

Ställ EN fråga i taget. Håll det naturligt, inte som ett formulär. Max 2 meningar per svar. När du har tillräckligt med information (5-7 utbyten), returnera ett JSON-objekt med nyckeln "profile_complete: true" och all insamlad data strukturerad.

Starta alltid med att presentera dig kort och fråga om de berättar om sin senaste dejtingupplevelse.

Format för avslutande JSON:
{
  "profile_complete": true,
  "attachment_style": "secure|anxious|avoidant|disorganized",
  "love_languages": ["words_of_affirmation", ...],
  "humor_register": "dry_irony|warmth|sarcasm|playful",
  "avg_message_length": 35,
  "emoji_density": 0.1,
  "opener_style": "observation|question|humor|direct",
  "dealbreakers": ["string", ...],
  "lifestyle_vectors": ["friluftsliv", ...]
}`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json() as { messages: Array<{ role: "user" | "assistant"; content: string }> };

  const response = await anthropic.messages.create({
    model: MODELS.CONVOOS_COMPLEX,
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Check if profile is complete
  const jsonMatch = text.match(/\{[\s\S]*"profile_complete":\s*true[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const profile = JSON.parse(jsonMatch[0]);
      await supabase.from("user_profiles").upsert({
        user_id: user.id,
        attachment_style: profile.attachment_style,
        love_languages: profile.love_languages,
        humor_register: profile.humor_register,
        avg_message_length: profile.avg_message_length,
        opener_style: profile.opener_style,
        hard_dealbreakers: profile.dealbreakers,
        lifestyle_vectors: profile.lifestyle_vectors,
        onboarding_completed: true,
      });
      return NextResponse.json({ text, profile_complete: true });
    } catch {
      // JSON parse failed, continue conversation
    }
  }

  return NextResponse.json({ text, profile_complete: false });
}

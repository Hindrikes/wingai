import { NextRequest, NextResponse } from "next/server";
import { analyzeProfile } from "@/lib/agents/profilexray-agent";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, MatchCard } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Ej autentiserad" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile, platform } = body;

    if (!profile?.bio) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Profildata saknas" },
        { status: 400 }
      );
    }

    // Hämta UserDNA
    const { data: userDna } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const analysis = await analyzeProfile(profile, userDna ?? {});

    // Spara matchkort i Supabase
    const { data: savedCard, error: saveError } = await supabase
      .from("match_cards")
      .insert({
        user_id: user.id,
        platform: platform ?? "other",
        platform_match_id: profile.platformMatchId ?? `manual_${Date.now()}`,
        display_name: profile.displayName,
        age: profile.age ?? null,
        occupation: profile.occupation ?? null,
        location: profile.location ?? null,
        chemistry_score: analysis.chemistryScore,
        longterm_score: analysis.longtermScore,
        risk_score: analysis.riskScore,
        effort_roi: analysis.effortRoi,
        green_flags: analysis.greenFlags,
        red_flags: analysis.redFlags,
        personality_signals: analysis.personalitySignals,
        compatibility_explanation: analysis.compatibilityExplanation,
        next_recommended_action: analysis.nextRecommendedAction,
        stage: "matched",
      })
      .select()
      .single();

    if (saveError) {
      console.error("[ProfileX-Ray] Sparfel:", saveError);
    }

    return NextResponse.json<ApiResponse<Partial<MatchCard>>>({
      data: savedCard ?? analysis,
      error: null,
    });
  } catch (error) {
    console.error("[ProfileX-Ray API]", error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Internt serverfel" },
      { status: 500 }
    );
  }
}

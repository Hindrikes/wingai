import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions } from "@/lib/agents/convoos-agent";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, ConvoAnalysis } from "@/types";

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
    const { conversationHistory, matchCardId, currentMessageCount } = body;

    if (!conversationHistory || !matchCardId) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "conversationHistory och matchCardId krävs" },
        { status: 400 }
      );
    }

    // Hämta UserDNA och MatchCard från Supabase
    const [dnaResult, cardResult] = await Promise.all([
      supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("match_cards")
        .select("*")
        .eq("id", matchCardId)
        .eq("user_id", user.id)
        .single(),
    ]);

    const suggestions = await generateSuggestions({
      conversationHistory,
      userDna: dnaResult.data ?? {},
      matchCard: cardResult.data ?? {},
      currentMessageCount: currentMessageCount ?? conversationHistory.length,
    });

    return NextResponse.json<ApiResponse<ConvoAnalysis>>({
      data: suggestions,
      error: null,
    });
  } catch (error) {
    console.error("[ConvoOS API]", error);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Internt serverfel" },
      { status: 500 }
    );
  }
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DateFlowPipeline } from "@/components/pipeline/DateFlowPipeline";
import type { MatchCard } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMatch(row: any): MatchCard {
  return {
    id: row.id,
    userId: row.user_id,
    platform: row.platform,
    platformMatchId: row.platform_match_id,
    displayName: row.display_name,
    age: row.age,
    occupation: row.occupation,
    location: row.location,
    chemistryScore: row.chemistry_score ?? 50,
    longtermScore: row.longterm_score ?? 50,
    riskScore: row.risk_score ?? 20,
    effortRoi: row.effort_roi ?? "medium",
    greenFlags: row.green_flags ?? [],
    redFlags: row.red_flags ?? [],
    personalitySignals: row.personality_signals ?? {},
    visualSignals: row.visual_signals ?? {},
    compatibilityExplanation: row.compatibility_explanation ?? "",
    nextRecommendedAction: row.next_recommended_action ?? null,
    stage: row.stage,
    conversationMomentum: row.conversation_momentum ?? null,
    lastMessageAt: row.last_message_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function PipelinePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: matches } = await supabase
    .from("match_cards")
    .select("*")
    .eq("user_id", user.id)
    .neq("stage", "closed")
    .order("updated_at", { ascending: false });

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .single();

  const firstName = userProfile?.display_name?.split(" ")[0] ?? "du";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-700 mb-1">Pipeline</p>
        <h1 className="font-serif text-3xl font-semibold text-ink-900">
          God dag, {firstName}
        </h1>
        <p className="text-sand-700 text-sm mt-1">
          {matches?.length ?? 0} aktiva matcher i din pipeline
        </p>
      </div>

      {/* Today's priority */}
      <TodaysPriority matches={(matches ?? []).map(mapMatch)} />

      {/* Pipeline */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-ink-900 text-lg">Din pipeline</h2>
          <a
            href="/import"
            className="text-xs font-semibold uppercase tracking-wide text-terra-500 hover:text-terra-600 transition-colors"
          >
            + Importera profil
          </a>
        </div>
        <DateFlowPipeline matches={(matches ?? []).map(mapMatch)} />
      </div>
    </div>
  );
}

function TodaysPriority({ matches }: { matches: MatchCard[] }) {
  const priority = matches.find(
    (m) =>
      m.conversationMomentum === "rising" &&
      m.stage === "active" &&
      m.chemistryScore > 70
  );

  if (!priority) return null;

  return (
    <div className="bg-ink-900 text-sand-100 rounded-xl p-4 mb-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-sand-500 mb-1">Dagens prioritet</div>
      <p className="text-sm font-medium">
        {priority.displayName} visar högt engagemang.
      </p>
      <p className="text-xs text-sand-500 mt-1">
        {priority.nextRecommendedAction ?? "Nu är rätt tillfälle att svara."}
      </p>
      <a
        href={`/conversation/${priority.id}`}
        className="mt-3 inline-block text-xs bg-terra-500 text-white px-3 py-1.5 rounded font-medium hover:bg-terra-600 transition-colors"
      >
        Visa konversation + förslag →
      </a>
    </div>
  );
}

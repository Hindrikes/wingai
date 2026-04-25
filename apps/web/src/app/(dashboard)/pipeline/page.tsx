import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DateFlowPipeline } from "@/components/pipeline/DateFlowPipeline";
import type { MatchCard } from "@/types";

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
        <h1 className="text-2xl font-bold text-wing-950">
          God dag, {firstName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {matches?.length ?? 0} aktiva matcher i din pipeline
        </p>
      </div>

      {/* Today's priority */}
      <TodaysPriority matches={matches as MatchCard[] ?? []} />

      {/* Pipeline */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-wing-900">Din pipeline</h2>
          <a
            href="/import"
            className="text-sm text-wing-600 hover:text-wing-700 transition-colors"
          >
            + Importera profil
          </a>
        </div>
        <DateFlowPipeline matches={matches as MatchCard[] ?? []} />
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
    <div className="bg-wing-600 text-white rounded-2xl p-4">
      <div className="text-xs font-medium text-wing-200 mb-1">DAGENS PRIORITET</div>
      <p className="text-sm font-medium">
        {priority.displayName} visar högt engagemang.
      </p>
      <p className="text-xs text-wing-200 mt-1">
        {priority.nextRecommendedAction ?? "Nu är rätt tillfälle att svara."}
      </p>
      <a
        href={`/conversation/${priority.id}`}
        className="mt-3 inline-block text-xs bg-white text-wing-600 px-3 py-1.5 rounded-lg font-medium hover:bg-wing-50 transition-colors"
      >
        Visa konversation + förslag →
      </a>
    </div>
  );
}

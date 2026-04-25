import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShareCard } from "@/components/analytics/ShareCard";

function StatCard({ label, value, sub, color = "wing" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-wing-100 p-5">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-wing-800">{label}</span>
        <span className="font-medium text-wing-900">{value}</span>
      </div>
      <div className="h-2 bg-wing-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-wing-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: matches } = await supabase
    .from("match_cards")
    .select("*")
    .eq("user_id", user.id);

  const { data: outcomes } = await supabase
    .from("conversation_outcomes")
    .select("*")
    .eq("user_id", user.id);

  const total = matches?.length ?? 0;
  const contacted = matches?.filter((m) => m.stage !== "discovered").length ?? 0;
  const dating = matches?.filter((m) => m.stage === "dating").length ?? 0;
  const avgChemistry = total > 0
    ? Math.round((matches ?? []).reduce((sum, m) => sum + (m.chemistry_score ?? 0), 0) / total)
    : 0;

  const styleStats = (outcomes ?? []).reduce<Record<string, { used: number; positive: number }>>(
    (acc, o) => {
      const style = o.style_used ?? "safe";
      if (!acc[style]) acc[style] = { used: 0, positive: 0 };
      acc[style].used++;
      if (o.response_received) acc[style].positive++;
      return acc;
    },
    {}
  );

  const styleLabels: Record<string, string> = {
    safe: "Säker",
    playful: "Lekfull",
    bold: "Djärv",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-wing-900 mb-1">Analys</h1>
        <p className="text-muted-foreground text-sm">Din dejtingprestanda, visualiserad.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Totalt matcher" value={String(total)} />
        <StatCard label="Kontaktade" value={String(contacted)} sub={`${total > 0 ? Math.round((contacted / total) * 100) : 0}% av alla`} />
        <StatCard label="Datar aktivt" value={String(dating)} color="emerald" />
        <StatCard label="Snitt-kemi" value={`${avgChemistry}%`} color="wing" />
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl border border-wing-100 p-6">
        <h2 className="font-medium text-wing-900 mb-5">Dejt-tratt</h2>
        <div className="space-y-4">
          <FunnelBar label="Discovered" value={total} max={total} />
          <FunnelBar label="Analyserade" value={contacted + dating} max={total} />
          <FunnelBar label="Kontaktade" value={contacted} max={total} />
          <FunnelBar label="Datar aktivt" value={dating} max={total} />
        </div>
      </div>

      {/* Message style performance */}
      {Object.keys(styleStats).length > 0 && (
        <div className="bg-white rounded-2xl border border-wing-100 p-6">
          <h2 className="font-medium text-wing-900 mb-5">Meddelandestil-prestanda</h2>
          <div className="space-y-4">
            {Object.entries(styleStats).map(([style, stats]) => {
              const rate = stats.used > 0 ? Math.round((stats.positive / stats.used) * 100) : 0;
              return (
                <div key={style} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-wing-800 w-16">
                      {styleLabels[style] ?? style}
                    </span>
                    <div className="w-32 h-2 bg-wing-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${rate}%`,
                          backgroundColor: rate >= 60 ? "#10b981" : rate >= 40 ? "#6171f1" : "#f87171",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-wing-900">{rate}% svar</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Viral share card */}
      {total > 0 && (
        <ShareCard
          total={total}
          contacted={contacted}
          dating={dating}
          avgChemistry={avgChemistry}
          topStyle={
            Object.entries(styleStats).sort((a, b) => {
              const rateA = a[1].used > 0 ? a[1].positive / a[1].used : 0;
              const rateB = b[1].used > 0 ? b[1].positive / b[1].used : 0;
              return rateB - rateA;
            })[0]?.[0] ?? null
          }
        />
      )}

      {total === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-medium text-wing-900 mb-1">Ingen data ännu</p>
          <p className="text-sm">Importera profiler och börja dejta för att se din statistik här.</p>
        </div>
      )}
    </div>
  );
}

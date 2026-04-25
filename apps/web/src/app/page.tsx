import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-wing-50 via-white to-wing-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦋</span>
            <span className="text-xl font-semibold text-wing-900">WingAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Logga in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-wing-600 text-white px-4 py-2 rounded-lg hover:bg-wing-700 transition-colors"
            >
              Kom igång gratis
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-wing-100 text-wing-700 text-sm px-3 py-1 rounded-full mb-6">
            <span>🇸🇪</span>
            <span>Byggt för den svenska dejtingmarknaden</span>
          </div>
          <h1 className="text-5xl font-bold text-wing-950 mb-6 leading-tight">
            Din AI-dejtingcoach.{" "}
            <span className="text-wing-600">På riktigt.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            WingAI analyserar dina matcher, skriver i din röst och hjälper dig
            boka fler dates. Inte en bot — din personliga strateg.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-wing-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-wing-700 transition-colors shadow-lg shadow-wing-200"
            >
              Börja gratis
            </Link>
            <Link
              href="#hur-det-fungerar"
              className="text-wing-600 px-8 py-3 rounded-xl text-lg font-medium hover:bg-wing-50 transition-colors"
            >
              Hur fungerar det?
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div
          id="hur-det-fungerar"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20"
        >
          {[
            {
              icon: "🔍",
              title: "ProfileX-Ray",
              desc: "AI analyserar varje match på under 3 sekunder. Kemikemi, lång­siktighet, risker och insats-ROI — allt i ett matchkort.",
            },
            {
              icon: "💬",
              title: "ConvoOS",
              desc: "Tre rankade meddelandeförslag i din röst. Säker, Lekfull eller Djärv. Med förklaringen varför — du väljer alltid.",
            },
            {
              icon: "📊",
              title: "DateFlow",
              desc: "Din pipeline för dejting. Se alla matcher, deras momentum och din veckoliga dating-ROI på ett ställe.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-wing-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-wing-900 mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-wing-950 mb-10">
            Enkla priser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Wing",
                price: "Gratis",
                desc: "Prova WingAI",
                features: [
                  "10 AI-förslag/månad",
                  "5 profilanalyser/månad",
                  "Grundläggande pipeline",
                  "1 plattformsintegration",
                ],
                cta: "Börja gratis",
                highlighted: false,
              },
              {
                name: "Co-Pilot",
                price: "249 kr/mån",
                desc: "För den aktive dejtaren",
                features: [
                  "Obegränsade AI-förslag",
                  "Obegränsade profilanalyser",
                  "Fullständig ConvoOS",
                  "3 plattformar",
                  "Analysdashboard",
                  "Dateförberedelse",
                ],
                cta: "Välj Co-Pilot",
                highlighted: true,
              },
              {
                name: "Autopilot",
                price: "699 kr/mån",
                desc: "Maximal effektivitet",
                features: [
                  "Allt i Co-Pilot",
                  "Autopilot-läge",
                  "Obegränsade plattformar",
                  "Veckovis AI-strategi",
                  "Prioriterad AI (Opus)",
                ],
                cta: "Välj Autopilot",
                highlighted: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border ${
                  tier.highlighted
                    ? "bg-wing-600 text-white border-wing-600 shadow-xl shadow-wing-200"
                    : "bg-white border-wing-100"
                }`}
              >
                <div className="mb-4">
                  <div
                    className={`text-sm font-medium mb-1 ${tier.highlighted ? "text-wing-200" : "text-muted-foreground"}`}
                  >
                    {tier.desc}
                  </div>
                  <div className="text-2xl font-bold">{tier.name}</div>
                  <div
                    className={`text-lg font-semibold mt-1 ${tier.highlighted ? "text-wing-100" : "text-wing-600"}`}
                  >
                    {tier.price}
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span
                        className={tier.highlighted ? "text-wing-200" : "text-sage-500"}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2 rounded-lg text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? "bg-white text-wing-600 hover:bg-wing-50"
                      : "bg-wing-600 text-white hover:bg-wing-700"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 text-sm text-muted-foreground">
          <p>
            🦋 WingAI — Byggt i Stockholm. GDPR-kompatibelt. Dina data stannar
            hos dig.
          </p>
        </footer>
      </div>
    </main>
  );
}

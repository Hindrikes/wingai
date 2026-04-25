import Link from "next/link";

function WingLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="9" fill="#C4532A" />
      <path
        d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-sand-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-sand-300 bg-sand-100/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <WingLogo size={30} />
          <span className="font-serif font-semibold text-ink-900 text-lg">Wing<em className="text-terra-500 not-italic">AI</em></span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-sand-700 hover:text-ink-900 transition-colors px-3 py-1.5">
            Logga in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-ink-900 text-sand-100 px-4 py-2 rounded hover:bg-ink-800 transition-colors font-medium"
          >
            Kom igång gratis
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 max-w-5xl">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-sand-300 text-sand-800 text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wide mb-8">
            <span>🇸🇪</span>
            <span>Byggt för den svenska dejtingmarknaden</span>
          </div>
          <h1 className="font-serif text-5xl font-semibold text-ink-900 mb-6 leading-tight text-balance">
            Din AI-dejtingcoach.{" "}
            <em className="text-terra-500 not-italic">På riktigt.</em>
          </h1>
          <p className="text-lg text-sand-700 mb-10 leading-relaxed">
            WingAI analyserar dina matcher, skriver i din röst och hjälper dig
            boka fler dates. Inte en bot — din personliga strateg.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-terra-500 text-white px-8 py-3 rounded font-medium hover:bg-terra-600 transition-colors"
            >
              Börja gratis
            </Link>
            <Link
              href="#hur-det-fungerar"
              className="text-ink-700 px-8 py-3 rounded font-medium hover:bg-sand-300 transition-colors"
            >
              Hur fungerar det?
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div
          id="hur-det-fungerar"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-24"
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
              className="bg-white rounded-xl p-6 border border-sand-400/60 hover:border-sand-500 hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-serif font-semibold text-ink-900 mb-2 text-lg">{f.title}</h3>
              <p className="text-sm text-sand-700 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-semibold text-center text-ink-900 mb-12">
            Enkla priser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                className={`rounded-xl p-6 border ${
                  tier.highlighted
                    ? "bg-ink-900 text-sand-100 border-ink-900"
                    : "bg-white border-sand-400/60"
                }`}
              >
                <div className="mb-5">
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${tier.highlighted ? "text-sand-500" : "text-sand-700"}`}>
                    {tier.desc}
                  </div>
                  <div className="font-serif text-2xl font-semibold">{tier.name}</div>
                  <div className={`text-lg font-medium mt-1 ${tier.highlighted ? "text-terra-400" : "text-terra-500"}`}>
                    {tier.price}
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className={tier.highlighted ? "text-forest-400" : "text-forest-600"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? "bg-terra-500 text-white hover:bg-terra-600"
                      : "bg-ink-900 text-sand-100 hover:bg-ink-800"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center border-t border-sand-300 pt-8 text-sm text-sand-700">
          <div className="flex justify-center mb-3">
            <WingLogo size={24} />
          </div>
          <p>WingAI — Byggt i Stockholm. GDPR-kompatibelt. Dina data stannar hos dig.</p>
        </footer>
      </div>
    </main>
  );
}

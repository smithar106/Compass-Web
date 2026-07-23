import Link from "next/link";
import { site } from "@/content/site";

const statColors: Record<string, { border: string; bg: string; value: string; circle: string }> = {
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50/40", value: "text-emerald-600", circle: "bg-emerald-100" },
  blue: { border: "border-blue-200", bg: "bg-blue-50/40", value: "text-blue-600", circle: "bg-blue-100" },
  amber: { border: "border-amber-200", bg: "bg-amber-50/40", value: "text-amber-600", circle: "bg-amber-100" },
  violet: { border: "border-violet-200", bg: "bg-violet-50/40", value: "text-violet-600", circle: "bg-violet-100" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero — dashboard panel */}
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="bg-white border-2 border-border rounded-xl p-8 shadow-sm">
              <h1 className="text-display font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline}
              </h1>
              <p className="mt-5 text-[15px] text-ink/80 font-[500]">{site.hero.subtitle}</p>
              <ul className="mt-5 space-y-2.5">
                {site.hero.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink font-medium">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-forest">{"\u2713"}</span>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/assessment"
                  className="inline-flex items-center px-8 py-3.5 bg-forest text-white text-base font-semibold rounded-lg hover:bg-leaf transition-colors shadow-sm"
                >
                  {site.hero.cta}
                </Link>
                <a
                  href="#example"
                  className="inline-flex items-center px-8 py-3.5 border-2 border-forest text-forest text-base font-semibold rounded-lg hover:bg-mist transition-colors"
                >
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>
            {/* Right: stat + decision mistakes */}
            <div className="space-y-4">
              <div className="bg-forest text-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="text-5xl font-bold leading-none">52%</span>
                  <div>
                    <p className="text-base text-cream/90 font-medium">AI projects never reach production.</p>
                    <p className="text-sm text-cream/60 mt-1">Compass validates the opportunity before implementation.</p>
                  </div>
                </div>
              </div>
              {site.hero.decisionMistakes.map((card) => (
                <div key={card.label} className="border-2 border-border rounded-xl bg-white shadow-sm overflow-hidden">
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center mt-0.5">
                        <span className="text-sm font-bold text-red-500">{"\u2717"}</span>
                      </span>
                      <div>
                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider">{card.label}</span>
                        <p className="text-base text-ink font-medium mt-0.5">{card.pain}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border/40 mx-5" />
                  <div className="px-5 pt-3 pb-4">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-forest/10 border border-forest/20 flex items-center justify-center mt-0.5">
                        <span className="text-sm font-bold text-forest">{"\u2713"}</span>
                      </span>
                      <div>
                        <span className="text-xs font-bold text-forest uppercase tracking-wider">Compass</span>
                        <p className="text-base text-forest font-semibold mt-0.5">{card.compassSolves}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Trust bar */}
          <div className="mt-8 border-2 border-border rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-stone/50 text-center">{site.trustedBy.label}</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-stone/40 font-medium mt-1">
              {site.trustedBy.sources.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Example — product card */}
      <section id="example" className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-border rounded-xl bg-white shadow-sm overflow-hidden">
            {/* Problem */}
            <div className="bg-amber-50/60 border-b-2 border-border/40 px-6 py-5">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Business problem</span>
              <p className="text-lg text-ink font-semibold mt-1">{site.example.problem}</p>
            </div>
            {/* Recommendation row */}
            <div className="px-6 py-5 border-b-2 border-border/40">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">Compass recommendation</span>
              <p className="text-base text-ink font-semibold mt-1">Process redesign plus deterministic routing improvements.</p>
            </div>
            {/* Metrics row */}
            <div className="px-6 py-5 flex flex-wrap gap-8">
              <div>
                <span className="text-xs text-stone">Expected impact</span>
                <p className="text-xl font-bold text-forest">28%</p>
              </div>
              <div>
                <span className="text-xs text-stone">Implementation time</span>
                <p className="text-xl font-bold text-ink">3 weeks</p>
              </div>
              <div>
                <span className="text-xs text-stone">Confidence</span>
                <p className="text-xl font-bold text-forest">{site.example.confidence}</p>
              </div>
            </div>
            {/* Reasoning */}
            <div className="bg-mist/30 border-t-2 border-border/40 px-6 py-4 flex items-center justify-between">
              <Link
                href="/assessment/results?example=true"
                className="text-sm text-forest font-semibold hover:text-leaf transition-colors"
              >
                View full analysis &rarr;
              </Link>
              <span className="text-xs text-stone/50">Based on assessment evidence and industry benchmarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence — compact proof cards */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-lg font-bold text-ink">{site.evidence.headline}</h2>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {site.evidence.cards.map((card) => {
              const c = statColors[card.color] || statColors.emerald;
              return (
                <div key={card.value} className={`border-2 ${c.border} ${c.bg} rounded-xl p-4 shadow-sm`}>
                  <p className="text-[13px] text-ink font-semibold leading-snug">{card.meaning}</p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className={`text-3xl font-bold ${c.value} tracking-tight`}>{card.value}</span>
                    <span className="text-[11px] text-stone/50 font-medium">{card.source}</span>
                  </div>
                  <p className="mt-2 text-[12px] text-ink/70 font-medium">{card.connection}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA panel */}
      <section className="py-section bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] font-bold">{site.finalCta.headline}</h2>
          <p className="mt-4 text-[15px] text-cream/80">{site.finalCta.subtitle}</p>
          <div className="mt-8">
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-3.5 bg-cream text-ink text-base font-semibold rounded-lg hover:bg-white transition-colors shadow-sm"
            >
              {site.finalCta.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
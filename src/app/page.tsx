import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import { researchStatistics } from "@/data/research";

function RecommendationCard({ data, color }: { data: any; color: string }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const colorMap: Record<string, { bg: string; text: string }> = {
    amber: { bg: "bg-amber-50", text: "text-amber-800" },
    sky: { bg: "bg-sky-50", text: "text-sky-800" },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <div className="border-2 border-border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className={`${c.bg} border-b-2 border-border/40 px-6 py-5`}>
        <span className={`text-xs font-bold ${c.text} uppercase tracking-wider`}>Customer problem</span>
        <p className="text-lg text-ink font-semibold mt-1">{data.problem}</p>
      </div>
      <div className="px-6 py-5 border-b-2 border-border/40">
        <span className="text-xs font-bold text-forest uppercase tracking-wider">Compass recommendation</span>
        <p className="text-lg text-ink font-semibold mt-1">{data.recommendation}</p>
      </div>
      <div className="px-6 py-5 flex items-center gap-6">
        <div>
          <span className="text-xs text-stone font-medium">Projected annual impact</span>
          <p className="text-4xl font-bold text-forest mt-1 tracking-tight">{data.impact}</p>
        </div>
        <div className="h-10 w-px bg-border flex-shrink-0" />
        <p className="text-sm text-ink leading-relaxed">{data.detail}</p>
      </div>
      <div className="bg-mist/30 px-6 py-3 border-t border-border/40">
        <p className="text-xs text-ink">{data.confidenceNote}</p>
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="mt-1 text-xs text-forest font-semibold hover:text-leaf transition-colors"
        >
          {showEvidence ? "Hide evidence" : "Why this confidence? \u2192"}
        </button>
        {showEvidence && (
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 text-xs">
              <span className="flex-shrink-0 w-4 h-4 rounded bg-forest/10 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-bold text-forest">{"\u2713"}</span>
              </span>
              <span className="text-ink"><span className="font-semibold">Industry benchmarks:</span> Comparable implementations show similar call recovery rates.</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="flex-shrink-0 w-4 h-4 rounded bg-forest/10 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-bold text-forest">{"\u2713"}</span>
              </span>
              <span className="text-ink"><span className="font-semibold">Research sources:</span> Gartner, IBM, and BCG studies on AI implementation outcomes.</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <span className="flex-shrink-0 w-4 h-4 rounded bg-forest/10 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-bold text-forest">{"\u2713"}</span>
              </span>
              <span className="text-ink"><span className="font-semibold">Customer inputs:</span> CRM data, call volume metrics, and staffing information provided during investigation.</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-mist/50 border-t-2 border-border/40 px-6 py-4 flex items-center justify-between">
        <Link href="/assessment/results?example=true" className="text-sm text-forest font-semibold hover:text-leaf transition-colors">
          {data.cta} &rarr;
        </Link>
        <span className="text-xs text-stone">Example based on real operational data</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="bg-white border-2 border-border rounded-xl p-8 shadow-sm">
              <h1 className="text-[2.5rem] md:text-display font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline}
              </h1>
              <p className="mt-5 text-base text-ink leading-relaxed font-[500]">
                {site.hero.subtitle}
              </p>
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
                <Link href="/assessment" className="inline-flex items-center px-8 py-3.5 bg-forest text-white text-base font-semibold rounded-lg hover:bg-leaf transition-colors shadow-sm">
                  {site.hero.cta}
                </Link>
                <a href="#example" className="inline-flex items-center px-8 py-3.5 border-2 border-forest text-forest text-base font-semibold rounded-lg hover:bg-mist transition-colors">
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Right: arrow flow cards */}
            <div className="space-y-4">
              {site.hero.outcomes.map((o) => (
                <div key={o.label} className="border-2 border-border rounded-xl bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider">Problem</p>
                      <p className="text-base text-ink font-semibold mt-0.5">{o.problem}</p>
                    </div>
                    <svg className="w-8 h-8 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="flex-shrink-0 text-center">
                      <p className="text-xs font-bold text-forest uppercase">Compass</p>
                      <p className="text-xs text-ink font-medium mt-0.5">{o.label}</p>
                    </div>
                    <svg className="w-8 h-8 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider">Outcome</p>
                      <p className="text-lg font-bold text-forest mt-0.5">{o.value}</p>
                      <p className="text-sm text-ink">{o.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evidence bar */}
      <section className="py-6 bg-cream border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-base text-ink font-semibold">{site.evidence.headline}</p>
          <p className="text-sm text-ink/80 mt-1 max-w-2xl mx-auto">{site.evidence.subtitle}</p>
        </div>
      </section>

      {/* Example: Sales */}
      <section id="example" className="py-[3.5rem] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <RecommendationCard data={site.example} color="amber" />
        </div>
      </section>

      {/* Example: Finance */}
      <section className="py-[3.5rem] px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="mx-auto max-w-4xl">
          <RecommendationCard data={site.exampleFinance} color="sky" />
        </div>
      </section>

      {/* Statistics — amber/warm tones */}
      <section className="py-[3.5rem] px-4 sm:px-6 lg:px-8 bg-amber-50/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[22px] font-bold text-ink text-center">Why implementation decisions go wrong.</h2>
          <p className="mt-2 text-sm text-ink/80 text-center">Before organizations find Compass, they often learn the hard way.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {researchStatistics.map((stat) => (
              <div key={stat.label} className="border-2 border-amber-200 rounded-xl p-5 bg-white shadow-sm text-center">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-ink mt-2">{stat.value}</p>
                <p className="text-sm text-ink mt-1 leading-snug">{stat.detail}</p>
                <p className="text-xs text-stone mt-2">{stat.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[3.5rem] bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] font-bold">{site.finalCta.headline}</h2>
          <p className="mt-4 text-base text-cream/90">{site.finalCta.subtitle}</p>
          <div className="mt-8">
            <Link href="/assessment" className="inline-flex items-center px-8 py-3.5 bg-cream text-ink text-base font-semibold rounded-lg hover:bg-white transition-colors shadow-sm">
              {site.finalCta.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
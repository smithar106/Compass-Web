import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — dashboard panel */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: value proposition */}
            <div className="bg-white border-2 border-border rounded-xl p-8 shadow-sm">
              <h1 className="text-display font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline.split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 ? <br /> : null}</span>
                ))}
              </h1>
              <p className="mt-5 text-[15px] text-ink/80 leading-relaxed font-[500]">
                {site.hero.subtitle}
              </p>
              <ul className="mt-6 space-y-2.5">
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

            {/* Right: decision mistakes + stat */}
            <div className="space-y-4">
              {/* Stat card */}
              <div className="bg-forest text-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="text-5xl font-bold leading-none">52%</span>
                  <div>
                    <p className="text-base text-cream/90 font-medium">AI projects never reach production.</p>
                    <p className="text-sm text-cream/60 mt-1">Compass validates the opportunity before implementation.</p>
                  </div>
                </div>
              </div>
              {/* Decision mistake cards */}
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
          {/* Trusted by */}
          <div className="mt-8 text-center">
            <p className="text-xs text-stone/50 mb-2">{site.trustedBy.label}</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-stone/40 font-medium">
              {site.trustedBy.sources.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compass example — individual cards */}
      <section id="example" className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[22px] font-bold text-ink">Compass in action.</h2>
          <div className="mt-6 space-y-3">
            {/* Problem card */}
            <div className="border-2 border-amber-200 bg-amber-50/30 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-amber-700">!</span>
                </span>
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Problem</span>
                  <p className="text-base text-ink font-medium mt-0.5">{site.example.problem}</p>
                </div>
              </div>
            </div>
            {/* Steps cards — gradient of colors */}
            {[
              { border: "border-amber-200", bg: "bg-amber-50/40", circle: "bg-amber-100", text: "text-amber-700" },
              { border: "border-sky-200", bg: "bg-sky-50/40", circle: "bg-sky-100", text: "text-sky-700" },
              { border: "border-indigo-200", bg: "bg-indigo-50/40", circle: "bg-indigo-100", text: "text-indigo-700" },
              { border: "border-forest/30", bg: "bg-forest/[0.04]", circle: "bg-forest/10", text: "text-forest" },
              { border: "border-leaf/30", bg: "bg-leaf/[0.04]", circle: "bg-leaf/10", text: "text-leaf" },
            ].map((colors, i) => {
              const step = site.example.steps[i];
              if (!step) return null;
              return (
                <div key={step.label} className={`border-2 ${colors.border} ${colors.bg} rounded-xl p-5 shadow-sm`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${colors.circle} flex items-center justify-center mt-0.5 text-xs font-bold ${colors.text}`}>{i + 1}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>{step.label}</span>
                      {step.value ? (
                        <p className="text-base text-ink font-semibold mt-0.5">{step.value}</p>
                      ) : (
                        <p className="text-sm text-stone mt-0.5 leading-relaxed">{step.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Confidence card */}
            <div className="border-2 border-forest/20 bg-forest/5 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone font-medium">Confidence</span>
                  <span className="text-3xl font-bold text-forest tracking-tight">{site.example.confidence}</span>
                </div>
                <span className="text-sm text-stone/70">Based on assessment evidence and industry benchmarks</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/assessment/results?example=true"
              className="inline-flex items-center px-6 py-3 border-2 border-forest text-forest text-sm font-semibold rounded-lg hover:bg-mist transition-colors shadow-sm"
            >
              {site.example.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Evidence panel */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-[22px] font-bold text-ink">{site.evidence.headline}</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {site.evidence.cards.map((card) => (
              <div key={card.value} className="bg-white border-2 border-border rounded-xl p-6 shadow-sm">
                <p className="text-[15px] text-ink font-semibold leading-snug">{card.meaning}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-forest tracking-tight">{card.value}</span>
                  <span className="text-sm text-stone/60 font-medium">{card.source}</span>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-border/40">
                  <p className="text-sm text-forest font-semibold">{card.connection}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-3 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-leaf transition-colors shadow-sm"
            >
              {site.evidence.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA panel */}
      <section className="py-section bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
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
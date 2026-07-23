import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — split layout */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: value proposition */}
            <div>
              <h1 className="text-display font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < 2 ? <br /> : null}</span>
                ))}
              </h1>
              <p className="mt-6 text-body text-ink/80 leading-relaxed max-w-xl font-[500]">
                {site.hero.subtitle}
              </p>
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

            {/* Right: decision mistakes — stronger cards */}
            <div className="space-y-4">
              {site.hero.decisionMistakes.map((card) => (
                <div key={card.label} className="border-2 border-border rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center mt-0.5">
                      <span className="text-sm font-bold text-red-500">{"\u2717"}</span>
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wider">{card.label}</span>
                      <p className="text-base text-ink font-medium mt-0.5 whitespace-pre-line">{card.pain}</p>
                    </div>
                  </div>
                  <div className="mt-3 ml-11 flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded bg-forest/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-forest">{"\u2713"}</span>
                    </span>
                    <p className="text-base text-forest font-semibold">{card.compassSolves}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evidence panel — meaning-first, left-aligned */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-heading font-bold text-ink">{site.evidence.headline}</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Compass example — software feel */}
      <section id="example" className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink">{site.example.headline}</h2>
          <div className="mt-8 border-2 border-border rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Problem header */}
            <div className="bg-forest/5 border-b-2 border-border/40 px-6 py-4">
              <span className="text-xs font-semibold text-forest uppercase tracking-wider">Business problem</span>
              <p className="mt-1 text-base text-ink font-medium">{site.example.problem}</p>
            </div>
            {/* Steps */}
            <div className="divide-y-2 divide-border/40">
              {site.example.steps.map((step, i) => (
                <div key={step.label} className="px-6 py-4 flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-mist flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-forest">{i + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-stone uppercase tracking-wider">{step.label}</span>
                    {step.value ? (
                      <p className="text-base text-ink font-semibold mt-0.5">{step.value}</p>
                    ) : (
                      <p className="text-sm text-stone mt-0.5 leading-relaxed">{step.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Confidence footer */}
            <div className="bg-forest/5 border-t-2 border-border/40 px-6 py-5 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone font-medium">Confidence</span>
                <span className="text-3xl font-bold text-forest tracking-tight">{site.example.confidence}</span>
              </div>
              <span className="text-sm text-stone/70">Based on assessment evidence and industry benchmarks</span>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/assessment/results?example=true"
              className="inline-flex items-center px-6 py-3 border-2 border-forest text-forest text-sm font-semibold rounded-lg hover:bg-mist transition-colors"
            >
              {site.example.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA panel */}
      <section className="py-section bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-heading font-bold">{site.finalCta.headline}</h2>
          <p className="mt-4 text-body text-cream/80">{site.finalCta.subtitle}</p>
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
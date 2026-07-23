import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — split layout */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: value proposition */}
            <div>
              <h1 className="text-display font-bold text-ink leading-[1.1]">
                {site.hero.headline.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < 2 ? <br /> : null}</span>
                ))}
              </h1>
              <p className="mt-6 text-body text-stone leading-relaxed max-w-xl">
                {site.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/assessment"
                  className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
                >
                  {site.hero.cta}
                </Link>
                <a
                  href="#example"
                  className="inline-flex items-center px-8 py-3 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
                >
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Right: pain cards */}
            <div className="space-y-3">
              {site.hero.painCards.map((card) => (
                <div key={card.label} className="border border-border rounded-lg p-4 bg-white">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-red-500">{"\u2717"}</span>
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{card.label}</span>
                      <p className="text-sm text-ink mt-0.5">{card.pain}</p>
                    </div>
                  </div>
                  <div className="mt-2 ml-8 flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-forest">{"\u2713"}</span>
                    </span>
                    <p className="text-sm text-forest">{card.compassSolves}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why companies struggle — 4 statistics */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">Why companies struggle with AI adoption.</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {site.evidence.cards.map((card) => (
              <div key={card.label} className="border border-border rounded-lg p-5 text-left bg-white flex flex-col">
                <p className="text-3xl font-bold text-forest">{card.value}</p>
                <p className="mt-1 text-sm text-ink leading-snug">{card.label}</p>
                <p className="mt-1 text-xs text-stone/60">{card.source}</p>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-forest font-medium">{card.takeaway}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-2.5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              Start your assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Example */}
      <section id="example" className="py-section px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.example.headline}</h2>
          <div className="mt-8 border border-border rounded-lg overflow-hidden bg-white">
            <div className="bg-mist/50 p-5 border-b border-border">
              <p className="text-sm text-ink font-medium">{site.example.problem}</p>
            </div>
            <div className="divide-y divide-border">
              {site.example.steps.map((step) => (
                <div key={step.label} className="p-4 flex items-start gap-4">
                  <span className="flex-shrink-0 w-28 text-xs font-semibold text-forest uppercase tracking-wider pt-0.5">
                    {step.label}
                  </span>
                  {step.value ? (
                    <span className="text-sm text-ink font-medium">{step.value}</span>
                  ) : (
                    <p className="text-sm text-stone leading-relaxed">{step.text}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-mist/30 p-4 border-t border-border flex items-center gap-6">
              <div>
                <p className="text-xs text-stone">Confidence</p>
                <p className="text-2xl font-bold text-forest">{site.example.confidence}</p>
              </div>
              <div className="text-xs text-stone">Based on evidence from assessment responses and industry benchmarks</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/assessment/results?example=true"
              className="inline-flex items-center px-6 py-2.5 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              {site.example.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.finalCta.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.finalCta.subtitle}</p>
          <div className="mt-8">
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.finalCta.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
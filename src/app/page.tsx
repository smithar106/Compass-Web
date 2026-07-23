import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-display font-bold text-ink">{site.hero.headline}</h1>
          <p className="mt-6 text-subhead text-stone max-w-2xl mx-auto leading-relaxed">
            {site.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-stone">
            {site.hero.options.map((opt) => (
              <span key={opt} className="px-2.5 py-1 bg-white border border-border rounded-full">
                {opt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI adoption fails */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-heading font-bold text-ink">{site.pain.headline}</h2>
            <p className="mt-4 text-body text-stone">{site.pain.subtitle}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {site.pain.cards.map((card) => (
              <div key={card.headline} className="border border-border rounded-lg p-5 bg-white">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-red-500">!</span>
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink">{card.headline}</h3>
                    <p className="mt-2 text-xs text-stone leading-relaxed">{card.pain}</p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-forest font-medium">
                        <span className="font-semibold">Compass: </span>
                        {card.compassSolves}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-ink text-cream rounded-lg p-6 text-center max-w-3xl mx-auto">
            <p className="text-sm leading-relaxed">{site.pain.thesis}</p>
          </div>
        </div>
      </section>

      {/* Compass intro — solution */}
      <section className="py-section px-4 sm:px-6 lg:px-8 bg-forest">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-cream">This is why Compass exists.</h2>
          <p className="mt-4 text-body text-cream/80 leading-relaxed">
            Compass analyzes your actual operations, investigates root causes, compares every possible intervention path — AI, software, process redesign, human work, hybrid, or no action — and recommends the one worth implementing. Every recommendation includes evidence, confidence, assumptions, and a detailed blueprint.
          </p>
          <div className="mt-8">
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-3 bg-cream text-ink text-sm font-medium rounded-lg hover:bg-white transition-colors"
            >
              {site.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Product Demonstration */}
      <section id="example" className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.exampleRecommendation.headline}</h2>
          <div className="mt-8 border border-border rounded-lg overflow-hidden bg-white">
            <div className="bg-mist/50 p-6 border-b border-border">
              <p className="text-sm text-ink font-medium">{site.exampleRecommendation.problem}</p>
            </div>
            <div className="divide-y divide-border">
              {site.exampleRecommendation.steps.map((step) => (
                <div key={step.label} className="p-5 flex items-start gap-4">
                  <span className="flex-shrink-0 w-40 text-xs font-semibold text-forest uppercase tracking-wider pt-0.5">
                    {step.label}
                  </span>
                  <div className="min-w-0">
                    {step.value ? (
                      <span className="text-sm text-ink font-medium">{step.value}</span>
                    ) : (
                      <p className="text-sm text-stone leading-relaxed">{step.text}</p>
                    )}
                    {step.detail && (
                      <span className="block text-xs text-stone mt-0.5">{step.detail}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/assessment/results?example=true"
              className="inline-flex items-center px-6 py-2.5 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              View the full Opportunity Map
            </Link>
          </div>
        </div>
      </section>

      {/* How Compass works */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.howItWorks.headline}</h2>
          <div className="mt-10 space-y-4">
            {site.howItWorks.steps.map((step) => (
              <div key={step.number} className="flex items-start gap-6 bg-white border border-border rounded-lg p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-stone leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Evidence */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.evidence.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">{site.evidence.body}</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {site.evidence.papers.map((paper) => (
              <div key={paper.source} className="border border-border rounded-lg p-5 bg-white flex flex-col">
                <p className="text-xs text-stone font-medium mb-2">{paper.source} &middot; {paper.year}</p>
                <p className="text-sm text-ink leading-relaxed mb-4">&ldquo;{paper.title}&rdquo;</p>
                <div className="mt-auto space-y-3">
                  <div className="bg-red-50 border border-red-100 rounded p-3">
                    <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider mb-0.5">What most conclude</p>
                    <p className="text-xs text-red-700">{paper.misinterpretation}</p>
                  </div>
                  <div className="bg-mist border border-forest/20 rounded p-3">
                    <p className="text-[11px] font-semibold text-forest uppercase tracking-wider mb-0.5">Compass perspective</p>
                    <p className="text-xs text-ink">{paper.compassInterpretation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Partners */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.designPartners.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.designPartners.subtitle}</p>
          <ul className="mt-8 space-y-3 text-left inline-block">
            {site.designPartners.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-stone">
                <span className="text-forest flex-shrink-0">{"\u2713"}</span>
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/design-partners"
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.designPartners.cta}
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-3 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              {site.designPartners.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pt-12 pb-32 px-4 sm:px-6 lg:px-8">
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
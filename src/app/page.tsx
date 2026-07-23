import Link from "next/link";
import { site } from "@/content/site";
import { researchStatistics } from "@/data/research";
import { researchPapers } from "@/data/research";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-forest bg-mist border border-forest/20 rounded-full mb-6">
            {site.hero.eyebrow}
          </span>
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
              href="#compass-example"
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

      {/* Pain section */}
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
                      <p className="text-xs text-stone leading-relaxed">
                        <span className="font-semibold text-ink">Underlying failure: </span>
                        {card.failure}
                      </p>
                      <p className="mt-2 text-xs text-forest font-medium">
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
            <p className="mt-2 text-sm text-cream/80 leading-relaxed">{site.pain.bridge}</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.statisticsSection.headline}</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {researchStatistics.map((stat) => (
              <div key={stat.label} className="border border-border rounded-lg p-5 text-center bg-white">
                <span className="text-display font-bold text-forest">{stat.value}</span>
                <p className="mt-1 text-sm font-semibold text-ink">{stat.label}</p>
                <p className="mt-1 text-xs text-stone leading-relaxed">{stat.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-stone">{site.statisticsSection.subtitle}</p>
          <div className="mt-6 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-2.5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.statisticsSection.cta}
            </Link>
          </div>
          <p className="mt-4 text-center text-[10px] text-stone/60">{site.statisticsSection.sourceLine}</p>
        </div>
      </section>

      {/* Root cause / category creation */}
      <section className="py-section bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold">{site.rootCause.headline}</h2>
          <p className="mt-4 text-body text-cream/80 leading-relaxed">
            {site.rootCause.body}
          </p>
          <p className="mt-8 text-xl font-bold text-cream leading-relaxed">
            {site.rootCause.thesis}
          </p>
          <p className="mt-8 text-sm text-cream/70 leading-relaxed">
            {site.rootCause.bridge}
          </p>
        </div>
      </section>

      {/* Product Demonstration */}
      <section id="compass-example" className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.exampleRecommendation.headline}</h2>
          <div className="mt-8 border border-border rounded-lg overflow-hidden bg-white">
            <div className="bg-mist/50 p-6 border-b border-border">
              <p className="text-sm text-ink font-medium">{site.exampleRecommendation.problem}</p>
            </div>
            <div className="divide-y divide-border">
              {site.exampleRecommendation.steps.map((step) => {
                const isRecommended = step.label === "Recommended";
                const isConfidence = step.label === "Confidence";
                return (
                  <div
                    key={step.label}
                    className={`p-5 flex items-start gap-4 ${isRecommended ? "bg-forest/5 border-l-2 border-forest" : ""}`}
                  >
                    <span className="flex-shrink-0 w-40 text-xs font-semibold text-forest uppercase tracking-wider pt-0.5">
                      {step.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      {step.value ? (
                        <span className={`text-sm font-medium ${isConfidence ? "text-2xl text-forest" : "text-ink"}`}>
                          {step.value}
                        </span>
                      ) : (
                        <p className="text-sm text-stone leading-relaxed">{step.text}</p>
                      )}
                      {step.detail && (
                        <span className="block text-xs text-stone mt-0.5">{step.detail}</span>
                      )}
                    </div>
                  </div>
                );
              })}
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
              <div
                key={step.number}
                className="flex items-start gap-6 bg-white border border-border rounded-lg p-5"
              >
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

      {/* Trust and explainability */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.trust.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">{site.trust.body}</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {site.trust.features.map((feature) => (
              <div
                key={feature.label}
                className="border border-border rounded-lg p-3 text-center"
              >
                <span className="text-xs text-ink font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-mist/50 rounded-lg p-5 text-center">
            <p className="text-sm text-stone">
              {site.trust.statement}
            </p>
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.differentiation.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">
            {site.differentiation.body}
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-white">
              <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-4">
                Execution tools
              </h3>
              <ul className="space-y-3">
                {site.differentiation.executionTools.map((tool) => (
                  <li key={tool} className="flex items-start gap-2 text-sm text-stone">
                    <span className="text-stone mt-0.5">&bull;</span>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-forest rounded-lg p-6 bg-forest/5">
              <h3 className="text-xs font-semibold text-forest uppercase tracking-wider mb-4">
                Compass
              </h3>
              <ul className="space-y-3">
                {site.differentiation.compassRole.map((role) => (
                  <li key={role} className="flex items-start gap-2 text-sm text-ink font-medium">
                    <span className="text-forest flex-shrink-0">&#10003;</span>
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research evidence */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.evidence.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">{site.evidence.body}</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {researchPapers.map((paper) => (
              <div
                key={paper.source}
                className="border border-border rounded-lg p-5 bg-white flex flex-col"
              >
                <p className="text-xs text-stone font-medium mb-2">{paper.source}</p>
                <p className="text-sm font-semibold text-ink mb-2">{paper.title}</p>
                <p className="text-xs text-stone leading-relaxed mb-4">
                  &ldquo;{paper.keyFinding}&rdquo;
                </p>
                {paper.methodology && (
                  <p className="text-xs text-stone/70 leading-relaxed mb-4 italic">
                    Methodology: {paper.methodology}
                  </p>
                )}
                <div className="mt-auto space-y-3">
                  <div className="bg-mist border border-forest/20 rounded p-3">
                    <p className="text-[11px] font-semibold text-forest uppercase tracking-wider mb-0.5">
                      Compass perspective
                    </p>
                    <p className="text-xs text-ink">{paper.compassInterpretation}</p>
                  </div>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-forest font-medium hover:underline"
                  >
                    View source &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/research"
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.evidence.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Design partners */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.designPartners.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.designPartners.subtitle}</p>
          <ul className="mt-8 space-y-3 text-left inline-block">
            {site.designPartners.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-stone">
                <span className="text-forest flex-shrink-0">{'\u2713'}</span>
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

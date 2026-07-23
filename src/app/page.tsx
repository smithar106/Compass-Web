import Link from "next/link";
import { site } from "@/content/site";
import { researchStatistics } from "@/data/research";

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

      {/* Recognition */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.recognition.headline}</h2>
          <div className="mt-8 space-y-3">
            {site.recognition.items.map((item) => (
              <div key={item} className="flex items-start gap-3 border border-border rounded-lg p-4 bg-white">
                <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-forest flex items-center justify-center mt-0.5">
                  <span className="text-forest text-xs font-bold">{"\u2713"}</span>
                </span>
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-forest font-medium">{site.recognition.bridge}</p>
        </div>
      </section>

      {/* Pain cards */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.pain.headline}</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {site.pain.cards.map((card) => (
              <div key={card.headline} className="border border-border rounded-lg p-5 bg-white">
                <h3 className="text-sm font-semibold text-red-600">{card.headline}</h3>
                <p className="mt-2 text-sm text-stone leading-relaxed">{card.pain}</p>
                <p className="mt-3 text-sm text-forest font-medium">{card.compassSolves}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compass flow */}
      <section className="py-section bg-forest px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-heading font-bold text-cream">{site.compassFlow.headline}</h2>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-2">
            {site.compassFlow.steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="bg-cream/15 text-cream text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap">
                  {step.label}
                </div>
                {i < site.compassFlow.steps.length - 1 && (
                  <svg className="w-4 h-4 text-cream/50 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-3 bg-cream text-ink text-sm font-medium rounded-lg hover:bg-white transition-colors"
            >
              {site.compassFlow.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Example */}
      <section id="example" className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.example.headline}</h2>
          <div className="mt-8 border border-border rounded-lg overflow-hidden bg-white">
            <div className="bg-mist/50 p-6 border-b border-border">
              <p className="text-sm text-ink font-medium">{site.example.problem}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-stone font-medium mb-1">Recommendation</p>
                <p className="text-sm text-ink font-semibold">{site.example.recommendation}</p>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-stone">Confidence</p>
                  <p className="text-2xl font-bold text-forest">{site.example.confidence}</p>
                </div>
                <div className="text-xs text-stone">{site.example.detail}</div>
              </div>
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

      {/* Research statistics */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.evidence.headline}</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {researchStatistics.slice(0, 4).map((stat) => (
              <div key={stat.label} className="border border-border rounded-lg p-5 text-center bg-white">
                <p className="text-2xl font-bold text-forest">{stat.value}</p>
                <p className="mt-1 text-xs text-stone leading-relaxed">{stat.detail}</p>
                <p className="mt-1 text-[10px] text-stone/60">{stat.source}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-stone max-w-xl mx-auto">{site.evidence.body}</p>
          <div className="mt-6 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-2.5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.evidence.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Design Partners */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
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
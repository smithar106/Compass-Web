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

      {/* Problem */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.problem.headline}</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="border border-red-200 bg-red-50/50 rounded-lg p-5 text-center">
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Wrong</span>
              <p className="mt-2 text-sm text-ink">{site.problem.wrong}</p>
            </div>
            <div className="border border-forest bg-mist/30 rounded-lg p-5 text-center">
              <span className="text-xs font-semibold text-forest uppercase tracking-wider">Better</span>
              <p className="mt-2 text-sm text-ink">{site.problem.better}</p>
            </div>
          </div>
          <p className="mt-6 text-body text-stone max-w-xl mx-auto">{site.problem.body}</p>
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

      {/* Trust */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.trust.headline}</h2>
          <p className="mt-4 text-body text-stone max-w-2xl mx-auto">{site.trust.body}</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {site.trust.features.map((f) => (
              <div key={f.label} className="border border-border rounded-lg p-4 bg-white text-center">
                <span className="text-sm font-medium text-ink">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.differentiation.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">{site.differentiation.body}</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="border border-border rounded-lg p-5 bg-white">
              <h3 className="text-sm font-semibold text-stone mb-3">Execution tools</h3>
              <ul className="space-y-2">
                {site.differentiation.executionTools.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone/40 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-forest bg-mist/20 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-forest mb-3">Compass</h3>
              <ul className="space-y-2">
                {site.differentiation.compassRole.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
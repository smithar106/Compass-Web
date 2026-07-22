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
            <Link
              href="/assessment/results?example=true"
              className="inline-flex items-center px-8 py-3 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              {site.hero.ctaSecondary}
            </Link>
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
          <p className="mt-4 text-body text-stone max-w-2xl mx-auto">{site.problem.body}</p>
          <div className="mt-8 space-y-3 text-left max-w-lg mx-auto">
            {site.problem.items.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-stone">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5">!</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insight */}
      <section className="py-section bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-leaf font-medium mb-2">The insight</p>
          <h2 className="text-heading font-bold">{site.insight.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.insight.body}</p>
        </div>
      </section>

      {/* Product Loop */}
      <section className="py-section px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.productLoop.headline}</h2>
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {site.productLoop.steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="bg-forest text-white text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap">
                  {step}
                </div>
                {i < site.productLoop.steps.length - 1 && (
                  <svg className="w-5 h-5 text-forest hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Tools */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.existingTools.headline}</h2>
          <p className="mt-4 text-body text-stone leading-relaxed">{site.existingTools.body}</p>
        </div>
      </section>

      {/* Trust */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.trust.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">{site.trust.body}</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
            {site.trust.features.map((f) => (
              <div key={f.label} className="border border-border rounded-lg p-4 text-center bg-white">
                <span className="text-sm font-medium text-ink">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-section bg-mist/50 border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-medium text-forest uppercase tracking-wider">Future vision</span>
          <h2 className="text-heading font-bold text-ink mt-2">{site.futureVision.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.futureVision.body}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {site.futureVision.items.map((item) => (
              <div key={item.title} className="border border-border rounded-lg p-4 bg-white">
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="text-xs text-stone mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Directions */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.fourDirections.headline}</h2>
          <p className="mt-2 text-sm text-stone text-center">{site.fourDirections.subtitle}</p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {site.fourDirections.directions.map((d) => (
              <div key={d.name} className="text-center p-4 border border-border rounded-lg bg-white">
                <div className="w-10 h-10 rounded-full bg-mist flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-forest">{d.name[0]}</span>
                </div>
                <h3 className="text-sm font-semibold text-ink mb-1">{d.label}</h3>
                <p className="text-xs text-stone leading-relaxed">{d.description}</p>
              </div>
            ))}
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
          <div className="mt-8">
            <Link
              href="/design-partners"
              className="inline-flex items-center px-8 py-3 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              Apply now
            </Link>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.founder.headline}</h2>
          <p className="mt-4 text-body text-stone leading-relaxed">{site.founder.body}</p>
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
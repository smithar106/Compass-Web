import Link from "next/link";
import { site } from "@/content/site";
import { OpportunityCard } from "@/components/home/opportunity-card";
import { mockResults } from "@/data/mock-results";

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
          <div className="mt-10">
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.problem.headline}</h2>
          <p className="mt-4 text-body text-stone text-center max-w-2xl mx-auto">{site.problem.body}</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {site.problem.approach.map((approach) => (
              <div
                key={approach.label}
                className={`rounded-lg border p-6 ${
                  approach.label === "The Compass approach"
                    ? "border-forest bg-mist/30"
                    : "border-border"
                }`}
              >
                <h3 className="text-sm font-semibold text-ink mb-4">{approach.label}</h3>
                <ul className="space-y-3">
                  {approach.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-stone">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5 ${
                          approach.label === "The Compass approach"
                            ? "bg-forest text-white"
                            : "bg-border text-stone"
                        }`}
                      >
                        {approach.label === "The Compass approach" ? "✓" : "×"}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.howItWorks.headline}</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {site.howItWorks.steps.map((step) => (
              <div key={step.step} className="text-center">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-forest text-white text-sm font-bold">
                  {step.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-stone leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.productPreview.headline}</h2>
          <p className="mt-4 text-body text-stone text-center">{site.productPreview.subtitle}</p>
          <div className="mt-10 space-y-4">
            {mockResults.opportunities.map((opp) => (
              <OpportunityCard key={opp.rank} opportunity={opp} />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-section px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-ink">{site.integrations.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.integrations.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {site.integrations.badges.map((badge) => (
              <div
                key={badge.name}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-white text-sm"
              >
                <span className="font-medium text-ink">{badge.name}</span>
                <span className="text-xs text-stone bg-cream px-2 py-0.5 rounded-full">{badge.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Triage Model */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.triageModel.headline}</h2>
          <p className="mt-4 text-body text-stone text-center">{site.triageModel.subtitle}</p>
          <div className="mt-10 space-y-4">
            {site.triageModel.tiers.map((tier, i) => (
              <div key={tier.name} className="flex items-start gap-4 border border-border rounded-lg p-5 bg-white">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mist flex items-center justify-center text-xs font-medium text-forest">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{tier.name}</h3>
                    <span className="text-xs text-stone">{tier.badge}</span>
                  </div>
                  <p className="mt-1 text-sm text-stone">{tier.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.differentiation.headline}</h2>
          <p className="mt-4 text-body text-stone text-center">{site.differentiation.subtitle}</p>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 font-semibold text-ink" />
                  <th className="text-left py-3 px-4 font-semibold text-forest">Compass</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone">Traditional Consulting</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone">AI Platforms</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone">Internal Analysis</th>
                </tr>
              </thead>
              <tbody>
                {site.differentiation.comparisons.map((row) => (
                  <tr key={row.aspect} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-ink whitespace-nowrap">{row.aspect}</td>
                    <td className="py-3 px-4 text-forest">{row.compass}</td>
                    <td className="py-3 px-4 text-stone">{row.consulting}</td>
                    <td className="py-3 px-4 text-stone">{row.aiPlatform}</td>
                    <td className="py-3 px-4 text-stone">{row.internal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Future Path */}
      <section className="py-section bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-heading font-bold">{site.futurePath.headline}</h2>
          <p className="mt-4 text-body text-stone">{site.futurePath.subtitle}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {site.futurePath.items.map((item) => (
              <div key={item.title} className="border border-stone/20 rounded-lg p-5">
                <h3 className="font-semibold text-cream">{item.title}</h3>
                <p className="mt-2 text-sm text-stone leading-relaxed">{item.description}</p>
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
                <span className="text-forest flex-shrink-0">✓</span>
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

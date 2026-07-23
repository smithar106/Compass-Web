import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-mist rounded-full text-xs font-medium text-forest">
            {site.hero.eyebrow}
          </div>
          <h1 className="text-display font-bold text-ink leading-[1.1]">
            {site.hero.headline.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 ? <br /> : null}</span>
            ))}
          </h1>
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
          <p className="mt-6 text-xs text-stone/60 max-w-md mx-auto">{site.hero.closing}</p>
        </div>
      </section>

      {/* Two risks */}
      <section className="py-section bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.twoRisks.headline}</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-6 bg-white">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink">{site.twoRisks.left.title}</h3>
              <p className="mt-2 text-sm text-stone leading-relaxed">{site.twoRisks.left.body}</p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-white">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink">{site.twoRisks.right.title}</h3>
              <p className="mt-2 text-sm text-stone leading-relaxed">{site.twoRisks.right.body}</p>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-forest font-medium">{site.twoRisks.bridge}</p>
        </div>
      </section>

      {/* Pain cards */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.painCards.headline}</h2>
          <p className="mt-2 text-sm text-stone text-center">{site.painCards.subtitle}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {site.painCards.cards.map((card) => (
              <div key={card.label} className="border border-border rounded-lg p-5 bg-white flex flex-col">
                <span className="text-xs font-semibold text-stone uppercase tracking-wider">{card.label}</span>
                <p className="mt-2 text-sm text-ink font-medium leading-snug">{card.pain}</p>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-forest leading-relaxed">{card.compassSolves}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product question */}
      <section className="py-section bg-forest px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading font-bold text-cream">{site.productQuestion.headline}</h2>
          <p className="mt-4 text-body text-cream/80 leading-relaxed">{site.productQuestion.subtitle}</p>
          <div className="mt-8">
            <a
              href="#example"
              className="inline-flex items-center px-8 py-3 bg-cream text-ink text-sm font-medium rounded-lg hover:bg-white transition-colors"
            >
              {site.productQuestion.cta}
            </a>
          </div>
        </div>
      </section>

      {/* Example */}
      <section id="example" className="py-section px-4 sm:px-6 lg:px-8">
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

      {/* Evidence */}
      <section className="py-section bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading font-bold text-ink text-center">{site.evidence.headline}</h2>
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
              href="/research"
              className="inline-flex items-center px-6 py-2.5 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              {site.evidence.cta}
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
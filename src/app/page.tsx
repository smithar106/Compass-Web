import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — outcome-focused */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="bg-white border-2 border-border rounded-xl p-8 shadow-sm">
              <h1 className="text-[2.5rem] md:text-display font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline}
              </h1>
              <p className="mt-5 text-[15px] text-ink/90 leading-relaxed font-[500]">
                {site.hero.subtitle}
              </p>
              <ul className="mt-5 space-y-2.5">
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
                <Link href="/assessment" className="inline-flex items-center px-8 py-3.5 bg-forest text-white text-base font-semibold rounded-lg hover:bg-leaf transition-colors shadow-sm">
                  {site.hero.cta}
                </Link>
                <a href="#example" className="inline-flex items-center px-8 py-3.5 border-2 border-forest text-forest text-base font-semibold rounded-lg hover:bg-mist transition-colors">
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Right: outcome metrics */}
            <div className="space-y-3">
              {site.hero.outcomes.map((o) => (
                <div key={o.label} className="border-2 border-border rounded-xl bg-white p-5 shadow-sm">
                  <p className="text-xs text-stone font-medium uppercase tracking-wider">{o.label}</p>
                  <p className="text-3xl font-bold text-forest mt-1">{o.value}</p>
                  <p className="text-sm text-ink/80 mt-0.5">{o.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evidence bar */}
      <section className="py-6 bg-cream border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-stone font-medium">{site.evidence.headline}</p>
          <p className="text-xs text-stone/70 mt-1 max-w-xl mx-auto">{site.evidence.subtitle}</p>
        </div>
      </section>

      {/* How Compass works */}
      <section className="py-[3.5rem] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-[22px] font-bold text-ink text-center">How Compass works.</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
            {["Problem", "Investigate", "Compare", "Recommend", "Plan"].map((step, i) => (
              <div key={step} className="border-2 border-border rounded-xl p-4 text-center bg-white shadow-sm">
                <span className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center mx-auto text-sm font-bold">{i + 1}</span>
                <p className="mt-2 text-sm font-semibold text-ink">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example recommendation */}
      <section id="example" className="py-[3.5rem] bg-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-border rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="bg-amber-50/60 border-b-2 border-border/40 px-6 py-5">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Customer problem</span>
              <p className="text-lg text-ink font-semibold mt-1">{site.example.problem}</p>
            </div>
            <div className="px-6 py-5 border-b-2 border-border/40">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">Compass recommendation</span>
              <p className="text-lg text-ink font-semibold mt-1">{site.example.recommendation}</p>
            </div>
            <div className="px-6 py-5 flex items-center gap-6">
              <div>
                <span className="text-xs text-stone font-medium">Projected annual impact</span>
                <p className="text-4xl font-bold text-forest mt-1 tracking-tight">{site.example.impact}</p>
              </div>
              <div className="h-10 w-px bg-border/60 flex-shrink-0" />
              <p className="text-sm text-stone leading-relaxed">{site.example.detail}</p>
            </div>
            <div className="bg-mist/50 border-t-2 border-border/40 px-6 py-4 flex items-center justify-between">
              <Link href="/assessment/results?example=true" className="text-sm text-forest font-semibold hover:text-leaf transition-colors">
                {site.example.cta} &rarr;
              </Link>
              <span className="text-xs text-stone/60">Example based on real operational data</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[3.5rem] bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] font-bold">{site.finalCta.headline}</h2>
          <p className="mt-4 text-[15px] text-cream/90">{site.finalCta.subtitle}</p>
          <div className="mt-8">
            <Link href="/assessment" className="inline-flex items-center px-8 py-3.5 bg-cream text-ink text-base font-semibold rounded-lg hover:bg-white transition-colors shadow-sm">
              {site.finalCta.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
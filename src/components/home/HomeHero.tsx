import Link from "next/link";
import { ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";
import { HeroTrustLine } from "./HeroTrustLine";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]"
      />

      <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-28 text-center sm:px-8 lg:pb-32 lg:pt-36">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 border border-line bg-surface px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-deep" />
            Built on real-world implementations
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-display font-semibold tracking-tight text-ink">
            Make Operational Decisions with Confidence.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-3xl text-lead leading-relaxed text-ink">
            Compass helps you identify the right intervention before you commit people, time, and
            capital.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-muted">
            Evidence. Recommendation. Implementation path. Measurement.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/#problems"
              className="group inline-flex items-center justify-center gap-2 bg-ink px-8 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              Explore Common Problems
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 border border-line bg-surface px-8 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Analyze My Problem
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-14 border-t border-line pt-8">
            <HeroTrustLine />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

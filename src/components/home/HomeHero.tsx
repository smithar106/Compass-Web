import Link from "next/link";
import { marketing } from "@/content/marketing";
import { ArrowIcon, Needle } from "./primitives";
import { Reveal } from "./Reveal";

export function HomeHero() {
  const h = marketing.home.hero;

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* faint grid + glow */}
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-24 text-center sm:px-8 lg:pb-28 lg:pt-32">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
            <Needle className="h-4 w-4" />
            {h.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-display font-semibold tracking-tight text-ink">
            The enterprise{" "}
            <em className="font-serif italic font-medium text-accent-deep">decision platform</em>
            .
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-2xl text-lead leading-relaxed text-muted">
            {h.supporting}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href={h.ctaPrimaryHref}
              className="group inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              {h.ctaPrimary}
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={h.ctaSecondaryHref}
              className="group inline-flex items-center justify-center gap-2 border border-line bg-surface px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              <PlayIcon />
              {h.ctaSecondary}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-10 flex items-center justify-center gap-2 text-[12.5px] text-muted">
            <span aria-hidden="true" className="flex h-1.5 w-1.5 rounded-full bg-accent-deep" />
            {h.trustLine}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.2 4.4 9.5 7l-4.3 2.6V4.4Z" fill="currentColor" />
    </svg>
  );
}

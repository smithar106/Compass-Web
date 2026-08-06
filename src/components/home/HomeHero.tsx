import Link from "next/link";
import { marketing } from "@/content/marketing";
import { ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";

export function HomeHero() {
  const h = marketing.home.hero;
  const [headlineLead, headlineAccent] = h.headline.split(". ");

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

      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-28 text-center sm:px-8 lg:pb-32 lg:pt-36">
        <Reveal>
          <h1 className="text-display font-semibold tracking-tight text-ink">
            {headlineLead}.{" "}
            <em className="font-serif italic font-medium text-accent-deep">{headlineAccent}.</em>
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="mx-auto mt-9 max-w-3xl text-lead leading-relaxed text-muted">
            {h.supporting}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] font-medium leading-relaxed text-ink">
            {h.supporting2}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href={h.ctaPrimaryHref}
              className="group inline-flex items-center justify-center gap-2 bg-ink px-8 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              {h.ctaPrimary}
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={h.ctaSecondaryHref}
              className="inline-flex items-center justify-center gap-2 border border-line bg-surface px-8 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              {h.ctaSecondary}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

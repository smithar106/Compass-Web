import Link from "next/link";
import { marketing } from "@/content/marketing";
import { ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";
import { LibraryStats } from "./LibraryStats";

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

        <Reveal delay={240}>
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-left border border-line bg-surface p-6">
            <div className="border-b pb-3 sm:border-b-0 sm:pb-0 sm:border-r border-line sm:pr-4">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">What do I give Compass?</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">A business problem</p>
            </div>
            <div className="border-b pb-3 sm:border-b-0 sm:pb-0 sm:border-r border-line sm:pr-4">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">What does Compass do?</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">Evaluates possible ways to solve it</p>
            </div>
            <div className="border-b pb-3 sm:border-b-0 sm:pb-0 sm:border-r border-line sm:pr-4">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">What do I get?</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">A defensible executive decision</p>
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Why trust it?</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">Economics + 50,000+ implementations</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-14 border-t border-line pt-8">
            <LibraryStats
              extraCells={[{ value: "11", label: "questions · under 60 seconds" }]}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

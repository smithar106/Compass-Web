import Link from "next/link";
import { marketing, controlRoom } from "@/content/marketing";
import { ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";
import { ControlRoomCard } from "./ControlRoomCard";

export function HomeHero() {
  const h = marketing.home.hero;
  const cr = controlRoom;

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

      <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-24 text-center sm:px-8 lg:pb-28 lg:pt-32">
        <Reveal>
          <p className="mx-auto max-w-3xl text-[13px] font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {cr.eyebrow}
          </p>
          <h1 className="mt-4 text-display font-semibold tracking-tight text-ink">
            Know what works
            <br />
            <em className="font-serif italic font-medium text-accent-deep">before you decide.</em>
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="mx-auto mt-7 max-w-3xl text-lead leading-relaxed text-muted">{h.supporting}</p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href={cr.ctaPrimaryHref}
              className="group inline-flex items-center justify-center gap-2 bg-ink px-8 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              {cr.ctaPrimary}
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={cr.ctaSecondaryHref}
              className="inline-flex items-center justify-center gap-2 border border-line bg-surface px-8 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              {cr.ctaSecondary}
            </Link>
          </div>
        </Reveal>

        {/* The product itself, immediately */}
        <Reveal delay={260}>
          <div className="mx-auto mt-14 max-w-3xl">
            <ControlRoomCard />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

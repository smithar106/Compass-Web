import Link from "next/link";
import { marketing } from "@/content/marketing";
import { ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";

export function HomeCta() {
  const c = marketing.home.cta;

  return (
    <section className="relative overflow-hidden bg-paper-dark">
      <div
        aria-hidden="true"
        className="grid-backdrop-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-title font-semibold tracking-tight text-paper">
            {c.headline}
          </h2>
          <p className="mx-auto mt-6 font-serif text-lead italic text-accent">{c.emphasis}</p>
          <div className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href={c.ctaPrimaryHref}
              className="group inline-flex items-center justify-center gap-2 bg-accent px-8 py-3.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-paper"
            >
              {c.ctaPrimary}
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={c.ctaSecondaryHref}
              className="inline-flex items-center justify-center gap-2 border border-paper/25 px-8 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              {c.ctaSecondary}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

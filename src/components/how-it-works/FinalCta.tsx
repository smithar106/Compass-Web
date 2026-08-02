import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { ArrowIcon } from "@/components/home/primitives";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-paper-dark">
      <div
        aria-hidden="true"
        className="grid-backdrop-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:px-10 lg:py-24">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
            Make operational decisions with confidence
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl text-title font-semibold tracking-tight text-paper">
            Bring Compass an operational problem.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lead leading-relaxed text-paper/70">
            Describe the workflow that is costing you. Get a defensible decision, the
            evidence behind it, and a clear path to implementation.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/analyze"
              className="group inline-flex items-center justify-center gap-2 bg-accent px-7 py-3.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-paper"
            >
              Analyze a Problem
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/evidence"
              className="inline-flex items-center justify-center gap-2 border border-paper/25 px-7 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              See the Evidence
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

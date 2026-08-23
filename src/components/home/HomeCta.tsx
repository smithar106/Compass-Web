import Link from "next/link";
import { ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-paper-dark">
      <div
        aria-hidden="true"
        className="grid-backdrop-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-title font-semibold tracking-tight text-paper">
            Before you implement anything, make sure it&rsquo;s the right thing.
          </h2>
          <div className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/#problems"
              className="group inline-flex items-center justify-center gap-2 bg-accent px-8 py-3.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-paper"
            >
              Explore Common Problems
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 border border-paper/25 px-8 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              Analyze My Problem
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

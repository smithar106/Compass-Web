import Link from "next/link";
import { PROBLEM_LIBRARY } from "@/data/prototype/problems";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./primitives";

/**
 * Section 2 — Start with the problem. Ten common operational problems as a
 * polished grid of clickable cards. No recommendations shown on the homepage;
 * clicking a card opens the Decision prototype for that problem.
 */
export function Problem() {
  return (
    <section id="problems" className="scroll-mt-16 border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow="Start with the problem"
          headline="What are you trying to improve?"
          subtitle="Choose a common operational problem to see how Compass evaluates it."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_LIBRARY.map((problem, idx) => (
            <Reveal key={problem.id} delay={idx * 40} className="h-full">
              <Link
                href={`/prototype/${problem.id}`}
                className="group flex h-full flex-col justify-between border border-line bg-paper px-6 py-6 transition-colors hover:border-ink/40 hover:bg-surface"
              >
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-accent-deep">
                    {problem.category}
                  </p>
                  <h3 className="mt-2.5 text-[15.5px] font-semibold leading-snug tracking-tight text-ink">
                    {problem.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {problem.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink transition-colors group-hover:text-muted">
                  Explore
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink underline decoration-accent-deep/50 underline-offset-4 transition-colors hover:text-muted"
            >
              Your problem is different? Describe it for a full analysis
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

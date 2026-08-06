import { Fragment } from "react";
import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function WhyCompass() {
  const w = marketing.home.howItWorks;
  const last = w.steps.length - 1;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={w.eyebrow} headline={w.headline} subtitle={w.supporting} align="center" />

        <div className="mx-auto mt-16 max-w-5xl">
          <ol className="flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-0">
            {w.steps.map((s, i) => (
              <Fragment key={s.number}>
                <li className="flex w-full max-w-[240px] flex-col items-center gap-3 text-center md:w-auto md:flex-1 md:px-2">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-deep/30 bg-accent-soft font-mono text-[13px] font-bold text-accent-deep"
                  >
                    {s.number}
                  </span>
                  <p className="text-[15px] font-semibold tracking-tight text-ink">{s.name}</p>
                </li>
                {i < last && (
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 rotate-90 items-center justify-center text-faint md:mt-4 md:rotate-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 8h11M9 3l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </Fragment>
            ))}
          </ol>
        </div>

        <Reveal delay={200}>
          <p className="mt-14 text-center font-serif text-[19px] italic leading-relaxed text-muted">
            The moat is memory, not models.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

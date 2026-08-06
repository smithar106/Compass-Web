import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function HowCompassWorks() {
  const h = marketing.home.howItWorks;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow={h.eyebrow}
          headline={h.headline}
          subtitle={h.supporting}
          align="center"
        />

        <div className="relative mt-14">
          {/* connector line */}
          <div
            aria-hidden="true"
            className="absolute left-6 top-0 h-full w-px bg-line sm:left-1/2 sm:h-px sm:w-full sm:-translate-x-1/2 sm:top-6 lg:top-10"
          />

          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.steps.map((s, i) => (
              <Reveal key={s.number} delay={i * 80}>
                <li className="relative flex h-full gap-5 rounded-md border border-line bg-surface p-6 sm:flex-col sm:gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent-deep/30 bg-accent-soft font-mono text-[13px] font-bold text-accent-deep"
                  >
                    {s.number}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-ink">{s.name}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.detail}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={200}>
          <p className="mt-10 flex items-center justify-center gap-2.5 text-center text-[13px] font-medium text-muted">
            <LoopIcon />
            The loop closes: every outcome becomes evidence for the next decision.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function LoopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M13.8 1.8v2.8h-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

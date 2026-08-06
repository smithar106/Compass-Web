import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const SECTIONS = [
  {
    label: "Recommendation",
    text: "Automated invoice matching with exception-based review — approved as a controlled pilot before scale.",
  },
  {
    label: "Business Impact",
    text: "40–60% lower processing cost · 90% fewer matching errors · measurable within 90 days.",
  },
  {
    label: "Evidence",
    text: "Grounded in comparable enterprise implementations with measured outcomes.",
  },
  {
    label: "Implementation Plan",
    text: "Baseline → Configure → Pilot → Scale, with success criteria defined before work begins.",
  },
];

export function ExecutiveBrief() {
  const b = marketing.home.brief;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={b.eyebrow} headline={b.headline} subtitle={b.supporting} align="center" />

        <Reveal delay={160}>
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel-lg">
              {/* document chrome */}
              <div className="flex items-center justify-between border-b border-line bg-paper/70 px-6 py-3.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Executive Recommendation
                </span>
                <span className="border border-line bg-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-faint">
                  Illustrative
                </span>
              </div>

              {/* brief body */}
              <div className="bg-[#e9f5ec] px-6 py-8 sm:px-10 sm:py-9">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-serif text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[26px]">
                    Approve AI-Powered Invoice Processing
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E5F3EA] px-3 py-1 text-[11px] font-bold text-[#14532d]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#1E7B4C]" />
                    Recommended for Pilot Approval
                  </span>
                </div>

                <dl className="mt-7 divide-y divide-[#d3e3d6]">
                  {SECTIONS.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-baseline sm:gap-8">
                      <dt className="w-40 shrink-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4C650C]">
                        {s.label}
                      </dt>
                      <dd className="text-[13.5px] leading-relaxed text-ink">{s.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <p className="mt-8 flex items-center justify-center gap-2.5 text-center text-[15px] font-semibold text-ink">
              <span
                aria-hidden="true"
                className="flex h-2 w-2 rounded-full bg-accent-deep"
              />
              {b.callout}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

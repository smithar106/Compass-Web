import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const C = {
  gold: "#8B6914",
  teal: "#0A5C55",
  green: "#14532D",
  rose: "#9D174D",
  silver: "#4A5568",
} as const;

const SECTIONS = [
  {
    label: "Economics",
    text: "P10: $0.5M · P50: $1.2M · P90: $1.9M. Implementation: $60K. Payback: ~3 months. 3-year ROI: 61×.",
    color: C.teal,
  },
  {
    label: "Why This Intervention",
    text: "High transaction volume, standardized workflow, low exception rate, and strong economics. Every rejected alternative was scored against the same criteria.",
    color: C.teal,
  },
  {
    label: "Evidence",
    text: "42 comparable implementations, 9 independently verified. Gold-tier evidence from government audits, academic evaluations, and public-company disclosures.",
    color: C.gold,
  },
  {
    label: "Alternatives",
    text: "AI: rejected — adds complexity without enough incremental benefit. Staffing: rejected — higher recurring cost. Software: viable alternative, lower expected impact.",
    color: C.rose,
  },
  {
    label: "Implementation",
    text: "4 phases: Map the workflow → Configure automation rules → Pilot → Scale. 12-week estimated duration. Success criteria defined before work begins.",
    color: C.silver,
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
              {/* Document chrome */}
              <div className="flex items-center justify-between border-b border-line bg-paper/70 px-6 py-3.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Decision Brief
                </span>
                <span className="border border-line bg-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-faint">
                  Illustrative
                </span>
              </div>

              {/* Brief body — matches the actual brief layout */}
              <div className="bg-[#F5F1E8] px-6 py-8 sm:px-10 sm:py-9">
                {/* Section 01: Recommendation */}
                <div className="border-b pb-6 mb-6" style={{ borderColor: "#D0C9B8" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.gold }}>
                        01 — Decision Recommendation
                      </span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E6F2F0] px-3 py-1 text-[11px] font-bold" style={{ color: C.teal }}>
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                      High confidence
                    </span>
                  </div>
                  <h3 className="font-serif text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[26px]">
                    Automate Invoice Processing
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#1A1A1A" }}>
                    Move invoice processing from manual matching to automated routing with exception-based review.
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink">
                    This approach is expected to save $708K annually against a $60K implementation cost with an expected payback of ~3 months. It ranked highest after comparing problem fit, economics, risk, feasibility, and available evidence.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { v: "$1.42M", l: "Expected Savings", c: C.teal },
                      { v: "$60K", l: "Implementation Cost", c: C.gold },
                      { v: "~3 months", l: "Expected Payback", c: C.silver },
                    ].map((kpi) => (
                      <div key={kpi.l} className="rounded-lg border bg-[#FBFAF6] px-3 py-3 relative overflow-hidden" style={{ borderColor: "#D0C9B8" }}>
                        <div aria-hidden="true" className="absolute left-0 top-0 h-0.5 w-full" style={{ backgroundColor: kpi.c }} />
                        <p className="text-[20px] font-bold leading-none text-ink">{kpi.v}</p>
                        <p className="mt-1 text-[10px] font-medium leading-tight text-muted">{kpi.l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sections 02–06 */}
                <dl className="divide-y" style={{ borderColor: "#D0C9B8" }}>
                  {SECTIONS.map((s, i) => (
                    <div key={s.label} className="py-3.5">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: s.color }}>
                          {String(i + 2).padStart(2, "0")} — {s.label}
                        </span>
                      </div>
                      <dd className="text-[13px] leading-relaxed text-ink">{s.text}</dd>
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
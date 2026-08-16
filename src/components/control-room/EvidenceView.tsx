import { useState } from "react";
import { SectionHeading } from "./ControlRoomShell";

const OUTCOME_BREAKDOWN = [
  { label: "31 observed outcomes", count: 31 },
  { label: "11 projected outcomes", count: 11 },
  { label: "5 mixed / qualitative", count: 5 },
];

const COMPARABLES = [
  {
    org: "West Midlands Police",
    intervention: "Robotic Process Automation",
    result: "299K duplicates removed · 22,000 hours saved",
    verified: true,
    passage:
      "Automating duplicate-record handling removed 299K duplicates and freed 22,000 hours of officer time, with claims independently verified against the source record.",
  },
  {
    org: "Whirlpool Corporation",
    intervention: "ISO 50001 energy management system",
    result: "15% energy consumption reduction · 450K first-year savings",
    verified: true,
    passage:
      "Deployed an ISO 50001-ready energy management system with process redesign, delivering a 15% reduction in energy consumption and 450,000 in first-year savings.",
  },
  {
    org: "Aon",
    intervention: "CRM United program with Oracle Cloud CX",
    result: "60X query performance · 15 hours saved/week",
    verified: true,
    passage:
      "Consolidated CRM onto Oracle Cloud CX, boosting query performance by 60X and saving 15 hours of manual data extraction time per week.",
  },
];

export function EvidenceView() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div id="evidence">
      <SectionHeading
        kicker="Evidence"
        title="Evidence behind this decision"
        sub="47 comparable implementations · 18 claim-verified metrics · High confidence"
      />

      {/* outcome breakdown */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OUTCOME_BREAKDOWN.map((o) => (
          <div key={o.label} className="border border-line bg-surface px-5 py-4">
            <p className="text-[clamp(1.5rem,2.2vw,1.9rem)] font-extralight leading-none text-ink">{o.count}</p>
            <p className="mt-1.5 text-[12px] font-semibold text-muted">{o.label}</p>
          </div>
        ))}
      </div>

      {/* strong comparables */}
      <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Three strong comparables</p>
      <div className="mt-3 space-y-3">
        {COMPARABLES.map((c, i) => (
          <article key={c.org} className="border border-line bg-surface">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-4 text-left"
            >
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">{c.org}</h3>
                <p className="text-[12px] font-medium text-muted">{c.intervention}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[13px] font-medium text-ink">{c.result}</p>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-valid">
                  <span aria-hidden="true">✓</span> Claim verified
                </span>
              </div>
            </button>
            {open === i && (
              <div className="border-t border-line bg-paper/60 px-5 py-4">
                <p className="text-[13px] leading-relaxed text-ink">{c.passage}</p>
                <p className="mt-2 text-[11.5px] font-semibold text-accent-deep">View source →</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* provenance chain */}
      <div className="mt-10 border border-line bg-surface p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">The provenance chain</p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink">
          Recommendation → reason → comparable → metric → source → exact passage.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-muted">
          {["Recommendation", "Reason", "Comparable", "Metric", "Source", "Passage"].map((s, i) => (
            <span key={s} className="inline-flex items-center gap-2">
              <span className="border border-line bg-paper px-2.5 py-1 text-ink">{s}</span>
              {i < 5 && <span aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

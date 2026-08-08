import { coverageByFunction, coverageSummary } from "@/data/demo-data";
import { StrengthDot } from "./badges";

export function CoveragePanel() {
  return (
    <section aria-label="Decision coverage">
      <h2 className="mb-1 text-[17px] font-semibold tracking-tight text-ink">Decision coverage</h2>

      <p className="mt-3 text-[clamp(1.15rem,2vw,1.3rem)] font-medium leading-snug text-ink">
        {coverageSummary.strong + coverageSummary.moderate} of {coverageByFunction.length} functions have
        strong or moderate coverage.
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
        Coverage gaps exist in {coverageSummary.thin + coverageSummary.insufficient} functions.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="border border-line bg-surface px-4 py-4 text-center">
          <p className="text-[28px] font-extralight leading-none tracking-[-0.02em] text-ok">{coverageSummary.strong}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Strong</p>
        </div>
        <div className="border border-line bg-surface px-4 py-4 text-center">
          <p className="text-[28px] font-extralight leading-none tracking-[-0.02em] text-brand-blue">{coverageSummary.moderate}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Moderate</p>
        </div>
        <div className="border border-line bg-surface px-4 py-4 text-center">
          <p className="text-[28px] font-extralight leading-none tracking-[-0.02em] text-warn">{coverageSummary.thin + coverageSummary.insufficient}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Gaps</p>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
        {coverageByFunction.map((c) => (
          <li key={c.businessFunction} className="flex items-center justify-between border-b border-line py-2 text-[12.5px]">
            <span className="text-ink">{c.businessFunction}</span>
            <span className="flex items-center gap-2 font-medium text-muted">
              <StrengthDot strength={c.strength} />
              {c.strength}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

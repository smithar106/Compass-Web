import { coverageByFunction, coverageSummary } from "@/data/demo-data";
import { StrengthDot } from "./badges";

const ROWS = [
  { key: "strong", label: "Strong evidence", bar: "bg-ok", count: coverageSummary.strong },
  { key: "moderate", label: "Moderate evidence", bar: "bg-brand-blue", count: coverageSummary.moderate },
  { key: "thin", label: "Thin evidence", bar: "bg-warn", count: coverageSummary.thin },
  { key: "insufficient", label: "Insufficient evidence", bar: "bg-risk", count: coverageSummary.insufficient },
] as const;

const MAX = Math.max(
  coverageSummary.strong,
  coverageSummary.moderate,
  coverageSummary.thin,
  coverageSummary.insufficient,
  1
);

export function CoveragePanel() {
  return (
    <section aria-label="Decision coverage">
      <h2 className="mb-1 text-[17px] font-semibold tracking-tight text-ink">Decision coverage</h2>
      <p className="mb-4 text-[12.5px] leading-relaxed text-muted">
        Where Compass can ground a recommendation in comparable implementations today.
      </p>

      <div className="border border-line bg-surface px-5 py-5">
        <div className="space-y-4">
          {ROWS.map((row) => (
            <div key={row.key}>
              <div className="flex items-baseline justify-between text-[12.5px]">
                <span className="font-medium text-ink">{row.label}</span>
                <span className="font-semibold text-muted">{row.count} business functions</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full ${row.bar}`}
                  style={{ width: `${(row.count / MAX) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
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

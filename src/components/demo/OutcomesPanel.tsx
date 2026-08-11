import Link from "next/link";
import { measuredOutcomes, outcomesSummary } from "@/data/demo-data";

const C = {
  teal: "#0A5C55",
  green: "#14532D",
  gold: "#8B6914",
  blue: "#1E40AF",
  purple: "#6D28D9",
} as const;

export function OutcomesPanel({ limit }: { limit?: number }) {
  const rows = limit ? measuredOutcomes.slice(0, limit) : measuredOutcomes;

  if (rows.length === 0) {
    return <p className="text-sm text-muted">No measured outcomes yet.</p>;
  }

  const pct = outcomesSummary.totalMetrics > 0
    ? Math.round((outcomesSummary.metOrExceeded / outcomesSummary.totalMetrics) * 100)
    : 0;

  return (
    <section aria-label="Results">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-4 w-0.5 rounded-full" style={{ backgroundColor: C.green }} />
          <h2 className="text-[17px] font-semibold tracking-tight text-ink">Results</h2>
        </div>
        {limit && (
          <Link href="/demo/outcomes" className="text-[12.5px] font-medium text-muted transition-colors hover:text-ink">
            View all outcomes →
          </Link>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="relative overflow-hidden border border-line bg-surface px-5 py-5 text-center">
          <div aria-hidden="true" className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: C.blue }} />
          <p className="text-[clamp(2rem,3vw,2.6rem)] font-extralight leading-none tracking-[-0.02em] text-ink">
            {outcomesSummary.completedDecisions}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-ink">Decisions completed</p>
        </div>
        <div className="relative overflow-hidden border border-[#cfe6d8] bg-[#f2faf5] px-5 py-5 text-center">
          <div aria-hidden="true" className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: C.green }} />
          <p className="text-[clamp(2rem,3vw,2.6rem)] font-extralight leading-none tracking-[-0.02em] text-[#14532d]">
            {pct}%
          </p>
          <p className="mt-2 text-[13px] font-semibold text-[#14532d]">Met or exceeded target</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper text-[11px] uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-bold">Decision</th>
              <th className="px-5 py-3 font-bold">Function</th>
              <th className="px-5 py-3 font-bold">Metric</th>
              <th className="px-5 py-3 font-bold">Expected</th>
              <th className="px-5 py-3 font-bold">Actual</th>
              <th className="px-5 py-3 font-bold">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => {
              const met = o.actual !== o.expected;
              return (
                <tr key={`${o.decisionId}-${o.metric}`} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-3.5">
                    <Link href={`/demo/decisions/${o.decisionId}`} className="font-semibold text-ink hover:underline">
                      {o.decision}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{o.businessFunction}</td>
                  <td className="px-5 py-3.5 text-ink">{o.metric}</td>
                  <td className="px-5 py-3.5 text-muted">{o.expected}</td>
                  <td className="px-5 py-3.5 font-semibold text-ink">{o.actual}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        met
                          ? "inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-2.5 py-0.5 text-[11px] font-bold text-[#14532d]"
                          : "inline-flex items-center gap-1.5 rounded-full bg-line px-2.5 py-0.5 text-[11px] font-bold text-muted"
                      }
                    >
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                      {met ? "Met or exceeded" : "On track"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
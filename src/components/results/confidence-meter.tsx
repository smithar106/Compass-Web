"use client";

interface Props {
  breakdown: Record<string, unknown>;
  confidence_explanation: string;
}

const FACTOR_LABELS: Record<string, string> = {
  comparable_implementations: "Comparable Implementations",
  unique_organizations: "Unique Organizations",
  average_evidence_score: "Evidence Quality",
  successful_implementations: "Outcome Consistency",
  outcome_measured_implementations: "Outcome Measurement",
  quantified_outcome_implementations: "Quantified Outcomes",
  negative_implementations: "Negative Implementations",
};

const FACTOR_ICONS: Record<string, string> = {
  comparable_implementations: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 11l2 2 4-4",
  unique_organizations: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  average_evidence_score: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8",
  outcome_consistency: "M22 12h-4l-3 9L9 3l-3 9H2",
  outcome_measurement: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  quantified_outcomes: "M2 12h20M12 2v20M20 12a8 8 0 0 1-16 0 8 8 0 0 1 16 0z",
  negative_implementations: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
};

function factorScore(factor: string, value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function factorMax(factor: string): number {
  if (factor === "comparable_implementations") return 50;
  if (factor === "unique_organizations") return 20;
  if (factor === "average_evidence_score") return 100;
  if (factor === "negative_implementations") return 10;
  if (factor === "outcome_measured_implementations") return 50;
  if (factor === "quantified_outcome_implementations") return 50;
  if (factor === "successful_implementations") return 50;
  return 100;
}

export function ConfidenceMeter({ breakdown, confidence_explanation }: Props) {
  const factors = Object.keys(FACTOR_LABELS)
    .filter((k) => k in breakdown)
    .map((k) => ({
      key: k,
      label: FACTOR_LABELS[k],
      icon: FACTOR_ICONS[k] || "",
      score: factorScore(k, breakdown[k]),
      max: factorMax(k),
    }));

  if (!factors.length && !confidence_explanation) return null;

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Confidence Breakdown</h3>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {factors.map((f) => {
            const pct = Math.min(Math.round((f.score / f.max) * 100), 100);
            const barColor = pct >= 70 ? "bg-lime-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
            return (
              <div key={f.key} className="flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                  <path d={f.icon} />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-xs text-gray-600 truncate">{f.label}</span>
                    <span className="text-xs font-mono text-gray-500 ml-2">{Math.round(f.score)}/{f.max}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {confidence_explanation && (
          <p className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
            {confidence_explanation}
          </p>
        )}
      </div>
    </div>
  );
}

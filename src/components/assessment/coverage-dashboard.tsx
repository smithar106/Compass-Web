"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { CoverageReport, CoverageSlice, DecisionCoverageRow } from "@/lib/coverage";

interface CoverageDashboardProps {
  liveOnly?: boolean;
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  strong: { label: "Strong", cls: "bg-forest text-white" },
  moderate: { label: "Moderate", cls: "bg-amber-500 text-white" },
  thin: { label: "Thin", cls: "bg-[#C4382C] text-white" },
  none: { label: "None", cls: "bg-line text-muted" },
};

function fmt(v: number): string {
  return v.toLocaleString("en-US");
}

export function CoverageDashboard({ liveOnly = false }: CoverageDashboardProps) {
  const [headline, setHeadline] = useState<CoverageReport["headline"] | null>(null);
  const [report, setReport] = useState<CoverageReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHeadline = useCallback(async () => {
    try {
      const res = await fetch("/api/coverage", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.headline) setHeadline(data.headline);
      else setError(data?.error || "Coverage unavailable");
    } catch {
      setError("Coverage unavailable");
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadHeadline();
      setLoading(false);
    })();
  }, [loadHeadline]);

  const runFromFeed = useCallback(
    async (records: unknown[], workflows?: string[]) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/coverage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records, workflows }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to compute coverage");
        setReport(data);
        setHeadline(data.headline);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to compute coverage");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  if (loading && !headline) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-[30vh]">
        <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && <p className="rounded-lg border border-line bg-warn/10 px-4 py-3 text-sm text-ink">{error}</p>}

      <section>
        <h2 className="text-heading font-bold text-ink">Implementation Intelligence</h2>
        <p className="mt-2 text-body text-stone">
          Decision coverage is the number of high-quality implementations behind each operational problem —
          the KPI that grows when every new record measurably improves recommendation confidence.
        </p>
      </section>

      {headline && (
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <HeadlineCard value={fmt(headline.implementations)} label="Implementations" />
            <HeadlineCard value={fmt(headline.high_quality)} label={`High-quality (${headline.high_quality_percent}%)`} accent />
            <HeadlineCard value={fmt(headline.organizations)} label="Organizations" />
            <HeadlineCard value={fmt(headline.industries)} label="Industries" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <HeadlineCard value={fmt(headline.gold)} label="Gold" tone="gold" />
            <HeadlineCard value={fmt(headline.silver)} label="Silver" tone="silver" />
            <HeadlineCard value={fmt(headline.bronze)} label="Bronze" tone="bronze" />
            <HeadlineCard value={fmt(headline.rejected)} label="Rejected" tone="rejected" />
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Decision Coverage by Operational Problem</h3>
          {report && <span className="text-[10px] uppercase tracking-wide text-faint">promotion queue → gold factory</span>}
        </div>

        {!report ? (
          <div className="mt-3 rounded-lg border border-dashed border-line bg-paper px-5 py-8 text-center">
            <p className="text-sm text-stone">
              {liveOnly
                ? "Dimension-level decision coverage requires a record feed."
                : "Connect a record feed to see which operational problems have strong high-quality implementation coverage."}
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper/60 text-[11px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-semibold">Operational Problem</th>
                  <th className="px-4 py-2.5 font-semibold">Business Function</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Implementations</th>
                  <th className="px-4 py-2.5 font-semibold text-right">High-Quality</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Avg Quality</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.decision_coverage.map((row: DecisionCoverageRow) => {
                  const sc = statusConfig[row.status] || statusConfig.none;
                  return (
                    <tr key={row.workflow} className="border-b border-line last:border-b-0">
                      <td className="px-4 py-2.5 font-medium text-ink">{row.label}</td>
                      <td className="px-4 py-2.5 text-stone">{row.business_function}</td>
                      <td className="px-4 py-2.5 text-right text-ink">{fmt(row.implementations)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-ink">{fmt(row.high_quality)}</td>
                      <td className="px-4 py-2.5 text-right text-stone">{row.average_quality.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={cn("inline-flex rounded px-2 py-0.5 text-[11px] font-semibold", sc.cls)}>{sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {report && report.uncovered_workflows.length > 0 && (
          <div className="mt-4 rounded-lg border border-line bg-paper px-4 py-3">
            <p className="text-xs font-semibold text-ink">Uncovered workflows (promotion targets)</p>
            <p className="mt-1 text-xs text-stone">{report.uncovered_workflows.join(", ")}</p>
          </div>
        )}
      </section>

      {report && (
        <section>
          <h3 className="text-sm font-semibold text-ink">Coverage by Business Function</h3>
          <DimensionGrid slices={report.by_business_function} />
        </section>
      )}
    </div>
  );
}

function HeadlineCard({
  value,
  label,
  accent,
  tone,
}: {
  value: string;
  label: string;
  accent?: boolean;
  tone?: "gold" | "silver" | "bronze" | "rejected";
}) {
  const toneCls =
    tone === "gold" ? "text-accent-deep"
    : tone === "silver" ? "text-[#475569]"
    : tone === "bronze" ? "text-[#92400e]"
    : tone === "rejected" ? "text-faint"
    : accent ? "text-forest"
    : "text-ink";
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className={cn("font-mono text-[22px] font-bold tracking-tight", toneCls)}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}

function DimensionGrid({ slices }: { slices: CoverageSlice[] }) {
  if (!slices.length) {
    return <p className="mt-3 text-sm text-stone">No records in this dimension.</p>;
  }
  return (
    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
      {slices.slice(0, 12).map((s) => {
        const sc = statusConfig[s.status] || statusConfig.none;
        const pct = s.total ? (s.high_quality / s.total) * 100 : 0;
        return (
          <div key={s.key} className="rounded-lg border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{s.label}</p>
              <span className={cn("inline-flex rounded px-2 py-0.5 text-[10px] font-semibold", sc.cls)}>{sc.label}</span>
            </div>
            <p className="mt-1 text-xs text-stone">
              {fmt(s.total)} implementations · {fmt(s.high_quality)} high-quality · {s.organizations} orgs
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-forest" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-faint">
              <span>Avg quality {s.average_quality.toFixed(2)}</span>
              <span>{s.high_quality_percent}% high-quality</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

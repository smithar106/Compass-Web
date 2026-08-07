"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  loadDecisionRegistry,
  rowFromDecision,
  fallbackRow,
  WORKSPACE_STATUSES,
  WORKSPACE_STATUS_LABELS,
  statusDotClass,
  statusWithWorkflow,
  formatDate,
  relativeTime,
  type WorkspaceDecisionRow,
  type WorkspaceStatus,
  type WorkflowState,
} from "@/lib/workspace";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/home/primitives";

interface CoverageHeadline {
  implementations?: number;
  organizations?: number;
  industries?: number;
  high_quality_percent?: number;
}

/** UI-shaped report from /api/gaps (engine Gap Engine v2, public read). */
interface GapsReport {
  total_records?: number;
  categories?: number;
  decision_coverage_by_function?: Record<
    string,
    { coverage_pct?: number; categories?: number; good_plus?: number }
  >;
  dimension_coverage?: Record<string, { n?: number; pct?: number }>;
  shopping_list?: Array<{
    workflow?: string;
    business_function?: string;
    decision_coverage?: string;
    expected_impact?: number;
    estimated_records_needed?: number;
  }>;
}

const STATUS_FILTERS: Array<WorkspaceStatus | "all"> = ["all", ...WORKSPACE_STATUSES];

export type WorkspaceView = "overview" | "decisions" | "coverage" | "intelligence";

export function Workspace({ view = "overview" }: { view?: WorkspaceView }) {
  const [rows, setRows] = useState<WorkspaceDecisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [coverage, setCoverage] = useState<CoverageHeadline | null>(null);
  const [coverageError, setCoverageError] = useState(false);
  const [gaps, setGaps] = useState<GapsReport | null>(null);
  const [gapsError, setGapsError] = useState(false);

  const [statusFilter, setStatusFilter] = useState<WorkspaceStatus | "all">("all");
  const [functionFilter, setFunctionFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [workflow, setWorkflow] = useState<Record<string, WorkflowState>>({});
  const [acting, setActing] = useState<Record<string, "approve" | "outcome" | "">>({});
  const [outcomeOpen, setOutcomeOpen] = useState<Record<string, boolean>>({});
  const [outcomeDraft, setOutcomeDraft] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      const entries = loadDecisionRegistry();
      if (entries.length === 0) {
        if (alive) setLoading(false);
      } else {
        const settled = await Promise.allSettled(
          entries.slice(0, 25).map((entry) =>
            fetch(`/api/decisions/${encodeURIComponent(entry.id)}`).then((res) =>
              res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))
            )
          )
        );
        if (!alive) return;
        const next = settled.map((result, i) =>
          result.status === "fulfilled" ? rowFromDecision(entries[i].id, result.value) : fallbackRow(entries[i])
        );
        next.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

        // Lifecycle state (approved / completed) comes from the engine.
        const wfSettled = await Promise.allSettled(
          entries.slice(0, 25).map((entry) =>
            fetch(`/api/decisions/${encodeURIComponent(entry.id)}/workflow`).then((res) =>
              res.ok ? res.json() : Promise.resolve(null)
            )
          )
        );
        if (!alive) return;
        const wfMap: Record<string, WorkflowState> = {};
        wfSettled.forEach((result, i) => {
          if (result.status === "fulfilled" && result.value) wfMap[entries[i].id] = result.value;
        });
        setWorkflow(wfMap);

        setRows(next);
        setLoadError(null);
        setLoading(false);
      }

      try {
        const res = await fetch("/api/coverage", { cache: "no-store" });
        if (!res.ok) {
          setCoverageError(true);
        } else {
          const data = await res.json();
          if (alive) setCoverage(data?.headline ?? null);
        }
      } catch {
        if (alive) setCoverageError(true);
      }

      if (view === "coverage") {
        try {
          const res = await fetch("/api/gaps", { cache: "no-store" });
          if (!res.ok) {
            setGapsError(true);
          } else {
            const data = await res.json();
            if (alive) setGaps(data ?? null);
          }
        } catch {
          if (alive) setGapsError(true);
        }
      }
    }

    void load();
    return () => {
      alive = false;
    };
  }, [view]);

  /** Rows with engine lifecycle state folded into the status. */
  const liveRows = useMemo(
    () => rows.map((r) => ({ ...r, status: statusWithWorkflow(r.status, workflow[r.id]) })),
    [rows, workflow]
  );

  const functions = useMemo(
    () => Array.from(new Set(liveRows.map((r) => r.businessFunction).filter((f) => f !== "—"))).sort(),
    [liveRows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return liveRows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (functionFilter !== "all" && r.businessFunction !== functionFilter) return false;
      if (q && ![r.title, r.recommendation, r.businessFunction].join(" ").toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [liveRows, statusFilter, functionFilter, search]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(WORKSPACE_STATUSES.map((s) => [s, 0])) as Record<WorkspaceStatus, number>;
    for (const r of liveRows) c[r.status] += 1;
    return c;
  }, [liveRows]);

  const latestId = useMemo(() => rows[0]?.id ?? null, [rows]);

  const approve = useCallback(async (id: string) => {
    setActionError(null);
    setActing((a) => ({ ...a, [id]: "approve" }));
    try {
      const res = await fetch(`/api/decisions/${encodeURIComponent(id)}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Approval failed");
      setWorkflow((w) => ({ ...w, [id]: { selected: true, outcome: w[id]?.outcome ?? false } }));
    } catch {
      setActionError("Could not approve this decision. Please try again.");
    } finally {
      setActing((a) => ({ ...a, [id]: "" }));
    }
  }, []);

  const reportOutcome = useCallback(async (id: string) => {
    const measuredResult = (outcomeDraft[id] ?? "").trim();
    if (!measuredResult) return;
    setActionError(null);
    setActing((a) => ({ ...a, [id]: "outcome" }));
    try {
      const res = await fetch(`/api/decisions/${encodeURIComponent(id)}/outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ measured_result: measuredResult }),
      });
      if (!res.ok) throw new Error("Outcome failed");
      setWorkflow((w) => ({ ...w, [id]: { selected: w[id]?.selected ?? false, outcome: true } }));
      setOutcomeOpen((o) => ({ ...o, [id]: false }));
      setOutcomeDraft((d) => ({ ...d, [id]: "" }));
    } catch {
      setActionError("Could not record this outcome. Please try again.");
    } finally {
      setActing((a) => ({ ...a, [id]: "" }));
    }
  }, [outcomeDraft]);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setFunctionFilter("all");
    setSearch("");
  }, []);

  const showPortfolio = view === "overview";
  const showDecisions = view === "overview" || view === "decisions";
  const showActivity = view === "overview" && rows.length > 0;
  const showCoverage =
    (view === "overview" && rows.length > 0) || view === "coverage" || view === "intelligence";

  return (
    <div className="space-y-12">
      {showPortfolio && (
        <>
          <section aria-label="Decision status summary">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-[17px] font-semibold tracking-tight text-ink">Portfolio status</h2>
              {liveRows.length > 0 && (
                <p className="text-[12.5px] font-medium text-muted">
                  {counts.approved + counts.pilot + counts.implementing + counts.completed} of{" "}
                  {liveRows.length} decisions in active lifecycle
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {WORKSPACE_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                  aria-pressed={statusFilter === s}
                  className={cn(
                    "border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep",
                    statusFilter === s
                      ? "border-ink bg-accent-soft"
                      : "border-line bg-surface hover:border-ink/40"
                  )}
                >
                  <span className={cn("inline-block h-2 w-2 rounded-full", statusDotClass(s))} />
                  <p className="mt-2 text-[24px] font-extrabold leading-none tracking-tight text-ink">
                    {counts[s]}
                  </p>
                  <p className="mt-1.5 text-[11.5px] font-semibold text-muted">
                    {WORKSPACE_STATUS_LABELS[s]}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section aria-label="Quick actions" className="flex flex-wrap items-center gap-3">
            <Link
              href="/assessment"
              className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
            >
              New Decision
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={latestId ? `/decisions/${latestId}` : "/assessment"}
              aria-disabled={!latestId}
              className={cn(
                "inline-flex items-center gap-2 border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep",
                latestId ? "text-ink hover:border-ink" : "pointer-events-none text-faint"
              )}
            >
              Open latest decision
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
            >
              View demo
            </Link>
          </section>
        </>
      )}

      {showDecisions &&
        (loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <p className="text-sm text-muted">Loading workspace...</p>
          </div>
        ) : rows.length === 0 ? (
          <section
            aria-label="Empty workspace"
            className="border border-line bg-surface px-6 py-16 text-center sm:px-10"
          >
            <h2 className="text-[20px] font-semibold tracking-tight text-ink">No decisions yet</h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted">
              Start by describing one operational problem. Compass will compare implementation paths
              and produce an executive recommendation.
            </p>
            <Link
              href="/assessment"
              className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
            >
              Start Assessment
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            {loadError && (
              <p role="alert" className="text-[12.5px] text-[#7a1f1a]">
                {loadError}
              </p>
            )}
            {actionError && (
              <p role="alert" className="text-[12.5px] text-[#7a1f1a]">
                {actionError}
              </p>
            )}

            <section aria-label="Filters" className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    aria-pressed={statusFilter === s}
                    className={cn(
                      "border px-3 py-1.5 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep",
                      statusFilter === s
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-surface text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {s === "all" ? "All statuses" : WORKSPACE_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-[12px] font-medium text-muted" htmlFor="ws-function-filter">
                  Function
                </label>
                <select
                  id="ws-function-filter"
                  value={functionFilter}
                  onChange={(e) => setFunctionFilter(e.target.value)}
                  className="border border-line bg-surface px-3 py-1.5 text-[13px] text-ink focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                >
                  <option value="all">All functions</option>
                  {functions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>

                <input
                  type="search"
                  aria-label="Search decisions"
                  placeholder="Search decisions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-xs border border-line bg-surface px-3 py-1.5 text-[13px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                />

                {(statusFilter !== "all" || functionFilter !== "all" || search) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[12.5px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </section>

            <section aria-label="Decisions">
              <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">
                Decisions <span className="text-muted">({filtered.length})</span>
              </h2>

              {filtered.length === 0 ? (
                <div className="border border-line bg-surface px-6 py-12 text-center">
                  <p className="text-[14px] text-muted">No decisions match the current filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-line bg-surface">
                  <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-line bg-paper text-[10.5px] uppercase tracking-wide text-muted">
                        <th className="px-5 py-3 font-bold">Decision</th>
                        <th className="px-5 py-3 font-bold">Function</th>
                        <th className="px-5 py-3 font-bold">Recommendation</th>
                        <th className="px-5 py-3 font-bold">Owner</th>
                        <th className="px-5 py-3 font-bold">Status</th>
                        <th className="px-5 py-3 font-bold">Date</th>
                        <th className="px-5 py-3 font-bold">Expected impact</th>
                        <th className="px-5 py-3 font-bold">Next action</th>
                        <th className="px-5 py-3 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.id} className="border-b border-line last:border-b-0 hover:bg-paper/60">
                          <td className="px-5 py-4">
                            <Link
                              href={`/decisions/${r.id}`}
                              className="font-semibold text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                            >
                              {r.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-muted">{r.businessFunction}</td>
                          <td className="px-5 py-4 text-ink">{r.recommendation}</td>
                          <td className="px-5 py-4 text-muted">{r.owner}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-ink">
                              <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClass(r.status))} />
                              {WORKSPACE_STATUS_LABELS[r.status]}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-muted">{formatDate(r.createdAt)}</td>
                          <td className="px-5 py-4 text-ink">{r.expectedImpact}</td>
                          <td className="px-5 py-4 text-muted">{r.nextAction}</td>
                          <td className="px-5 py-4">
                            {r.status === "completed" ? (
                              <span className="text-[11.5px] font-bold text-ok">✓ Measured</span>
                            ) : r.status === "approved" ? (
                              outcomeOpen[r.id] ? (
                                <span className="flex items-center gap-2">
                                  <input
                                    aria-label="Measured result"
                                    value={outcomeDraft[r.id] ?? ""}
                                    onChange={(e) =>
                                      setOutcomeDraft((d) => ({ ...d, [r.id]: e.target.value }))
                                    }
                                    placeholder="e.g. Cost down 42% in 90 days"
                                    className="w-44 border border-line bg-surface px-2 py-1.5 text-[12px] text-ink placeholder:text-faint focus:border-ink focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => reportOutcome(r.id)}
                                    disabled={!outcomeDraft[r.id]?.trim() || acting[r.id] === "outcome"}
                                    className="border border-ink bg-ink px-2.5 py-1.5 text-[11.5px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    {acting[r.id] === "outcome" ? "Saving…" : "Save"}
                                  </button>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setOutcomeOpen((o) => ({ ...o, [r.id]: true }))}
                                  className="border border-line bg-surface px-2.5 py-1.5 text-[11.5px] font-semibold text-ink transition-colors hover:border-ink/40"
                                >
                                  Report outcome
                                </button>
                              )
                            ) : r.status === "under_review" ? (
                              <button
                                type="button"
                                onClick={() => approve(r.id)}
                                disabled={acting[r.id] === "approve"}
                                className="border border-ink bg-ink px-2.5 py-1.5 text-[11.5px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {acting[r.id] === "approve" ? "Approving…" : "Approve"}
                              </button>
                            ) : (
                              <span className="text-[11.5px] text-faint">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ))}

      {showActivity && (
        <section aria-label="Recent activity">
          <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Recent activity</h2>
          <ol className="border border-line bg-surface">
            {liveRows.slice(0, 6).map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-3 border-b border-line px-5 py-3.5 last:border-b-0"
              >
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                    Recommendation created
                  </p>
                  <Link
                    href={`/decisions/${r.id}`}
                    className="mt-0.5 block text-[13.5px] font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                  >
                    {r.title}
                  </Link>
                  <p className="mt-0.5 text-[11.5px] text-faint">{relativeTime(r.createdAt)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {showCoverage && (
        <section aria-label="Decision coverage">
          <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Decision coverage</h2>
          {coverageError ? (
            <div className="border border-line bg-surface px-5 py-8 text-center">
              <p className="text-[13px] leading-relaxed text-muted">
                Coverage is temporarily unavailable. Your decisions are unaffected.
              </p>
            </div>
          ) : coverage ? (
            <div className="border border-line bg-surface">
              <dl className="grid grid-cols-2 gap-px bg-line">
                {[
                  { label: "Implementations", value: coverage.implementations?.toLocaleString("en-US") ?? "—" },
                  { label: "Organizations", value: coverage.organizations?.toLocaleString("en-US") ?? "—" },
                  { label: "Industries", value: coverage.industries?.toLocaleString("en-US") ?? "—" },
                  { label: "High-quality evidence", value: coverage.high_quality_percent != null ? `${coverage.high_quality_percent}%` : "—" },
                ].map((s) => (
                  <div key={s.label} className="bg-surface px-5 py-4">
                    <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{s.label}</dt>
                    <dd className="mt-1 text-[22px] font-extrabold tracking-tight text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-line px-5 py-3.5 text-[11.5px] leading-relaxed text-faint">
                Executive-level evidence library summary from the live coverage API.
              </p>
            </div>
          ) : (
            <div className="border border-line bg-surface px-5 py-8 text-center">
              <p className="text-[13px] text-muted">Coverage data is loading…</p>
            </div>
          )}

        </section>
      )}

      {view === "coverage" && (
        <section aria-label="Evidence gaps" className="mt-8">
          <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">
            Where evidence is thin
          </h2>
          {gapsError ? (
            <div className="border border-line bg-surface px-5 py-8 text-center">
              <p className="text-[13px] leading-relaxed text-muted">
                Gap analysis is temporarily unavailable.
              </p>
            </div>
          ) : gaps && gaps.shopping_list?.length ? (
            <div className="border border-line bg-surface">
              <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
                {Object.entries(gaps.decision_coverage_by_function ?? {})
                  .sort((a, b) => (a[1]?.coverage_pct ?? 0) - (b[1]?.coverage_pct ?? 0))
                  .slice(0, 6)
                  .map(([fn, agg]) => (
                    <div key={fn} className="bg-surface px-5 py-4">
                      <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                        {fn.replace(/_/g, " ")}
                      </dt>
                      <dd className="mt-1 text-[22px] font-extrabold tracking-tight text-ink">
                        {agg.coverage_pct != null ? `${agg.coverage_pct}%` : "—"}
                        <span className="ml-2 text-[11px] font-medium text-faint">
                          {agg.good_plus ?? 0}/{agg.categories ?? 0} categories at good+
                        </span>
                      </dd>
                    </div>
                  ))}
              </div>
              <table className="w-full border-t border-line text-left">
                <thead>
                  <tr className="border-b border-line text-[10.5px] font-bold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3">Priority gap</th>
                    <th className="px-5 py-3">Coverage</th>
                    <th className="px-5 py-3">Impact</th>
                    <th className="px-5 py-3">Needed</th>
                  </tr>
                </thead>
                <tbody>
                  {gaps.shopping_list.slice(0, 8).map((n) => (
                    <tr key={`${n.workflow}-${n.business_function}`} className="border-b border-line last:border-b-0">
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-semibold text-ink">
                          {n.workflow?.replace(/_/g, " ")}
                        </span>
                        <span className="ml-2 text-[11px] text-faint">
                          {n.business_function?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12.5px] text-muted">
                        {n.decision_coverage?.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3 text-[12.5px] text-muted">
                        {n.expected_impact != null ? `${Math.round(n.expected_impact * 100)}%` : "—"}
                      </td>
                      <td className="px-5 py-3 text-[12.5px] text-muted">
                        {n.estimated_records_needed ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-line px-5 py-3.5 text-[11.5px] leading-relaxed text-faint">
                Decision coverage by function and the ranked shopping list from the Evidence Gap
                Engine — where Compass is actively filling evidence.
              </p>
            </div>
          ) : (
            <div className="border border-line bg-surface px-5 py-8 text-center">
              <p className="text-[13px] text-muted">Gap analysis is loading…</p>
            </div>
          )}
        </section>
      )}

      {view === "intelligence" && (
        <section aria-label="Implementation Intelligence">
          <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">
            How evidence grounds your decisions
          </h2>
          <p className="mb-6 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Every recommendation in your workspace is built on documented enterprise implementations
            with measured outcomes — then matched to your industry, process, and operating
            constraints. When the evidence is thin, Compass says so.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Real implementation evidence",
                body: "Recommendations are built on documented implementations with measured outcomes — not opinion.",
              },
              {
                title: "Matched to your context",
                body: "Evidence is compared against your industry, process, and operating constraints.",
              },
              {
                title: "Keeps getting better",
                body: "Every completed decision and measured outcome sharpens the next recommendation.",
              },
            ].map((f) => (
              <div key={f.title} className="border border-line bg-surface px-5 py-5">
                <p className="text-[14px] font-semibold tracking-tight text-ink">{f.title}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

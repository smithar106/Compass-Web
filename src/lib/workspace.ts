/**
 * Workspace helpers — pure, unit-testable logic for the /workspace shell.
 *
 * Decisions are tracked via a browser-local registry of recommendation IDs
 * created from this browser (the assessment flow), and each decision's content
 * is loaded from the persisted engine record through the existing
 * /api/decisions/[id] proxy. No production data is fabricated; anything
 * unavailable renders as "—" or an explicit empty state.
 */

export const DECISION_REGISTRY_KEY = "compass-decision-history";
export const DECISION_REGISTRY_MAX = 50;

export interface DecisionRegistryEntry {
  id: string;
  createdAt: string;
}

export function loadDecisionRegistry(): DecisionRegistryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DECISION_REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is DecisionRegistryEntry => !!x && typeof x.id === "string")
      .slice(0, DECISION_REGISTRY_MAX);
  } catch {
    return [];
  }
}

export function recordDecision(id: string, createdAt?: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const entry: DecisionRegistryEntry = {
      id,
      createdAt: createdAt || new Date().toISOString(),
    };
    const next = [entry, ...loadDecisionRegistry().filter((x) => x.id !== id)].slice(
      0,
      DECISION_REGISTRY_MAX
    );
    window.localStorage.setItem(DECISION_REGISTRY_KEY, JSON.stringify(next));
  } catch {}
}

export const WORKSPACE_STATUSES = [
  "draft",
  "under_review",
  "approved",
  "pilot",
  "implementing",
  "completed",
] as const;

export type WorkspaceStatus = (typeof WORKSPACE_STATUSES)[number];

export const WORKSPACE_STATUS_LABELS: Record<WorkspaceStatus, string> = {
  draft: "Draft",
  under_review: "Under Review",
  approved: "Approved",
  pilot: "Pilot",
  implementing: "Implementing",
  completed: "Completed",
};

const STATUS_DOTS: Record<WorkspaceStatus, string> = {
  draft: "bg-faint",
  under_review: "bg-brand-blue",
  approved: "bg-ok",
  pilot: "bg-warn",
  implementing: "bg-[#762ee8]",
  completed: "bg-accent-deep",
};

export function statusDotClass(status: WorkspaceStatus): string {
  return STATUS_DOTS[status];
}

/** Map a persisted record's engine status onto the workspace lifecycle. */
export function workspaceStatusFromAnalysis(analysis: unknown): WorkspaceStatus {
  const status = (analysis as { status?: string } | null)?.status;
  if (status === "awaiting_answers") return "draft";
  // A generated recommendation (decision_ready, insufficient_evidence, etc.)
  // is a decision awaiting the executive's review.
  return "under_review";
}

export interface WorkflowState {
  selected: boolean;
  outcome: boolean;
}

/** Combine engine lifecycle state (selection/outcome) with the base status. */
export function statusWithWorkflow(base: WorkspaceStatus, wf?: WorkflowState | null): WorkspaceStatus {
  if (!wf) return base;
  if (wf.outcome) return "completed";
  if (wf.selected) return "approved";
  return base;
}

export interface WorkspaceDecisionRow {
  id: string;
  title: string;
  businessFunction: string;
  recommendation: string;
  owner: string;
  status: WorkspaceStatus;
  createdAt: string | null;
  expectedImpact: string;
  nextAction: string;
}

function formatRange(low: unknown, high: unknown, unit: unknown): string | null {
  const l = typeof low === "number" ? low : null;
  const h = typeof high === "number" ? high : null;
  if (l === null && h === null) return null;
  const u = unit === "%" ? "%" : typeof unit === "string" && unit ? ` ${unit}` : "";
  if (l === null) return `${h}${u}`;
  if (h === null || l === h) return `${l}${u}`;
  return `${l}–${h}${u}`;
}

function formatCurrency(n: unknown): string | null {
  if (typeof n !== "number" || !isFinite(n) || n <= 0) return null;
  if (n >= 1000) {
    const k = Math.round(n / 1000);
    return `$${k}K`;
  }
  return `$${Math.round(n)}`;
}

/** Evidence-derived expected impact, preferring outcome ranges. */
export function expectedImpactFromTop(top: unknown): string {
  const t = (top ?? {}) as {
    outcome_ranges?: { metric_label?: string; low?: number; high?: number; unit?: string }[];
    impact?: { annual_savings?: { low?: number; high?: number; expected?: number } };
  };
  const range = Array.isArray(t.outcome_ranges) ? t.outcome_ranges[0] : undefined;
  if (range?.metric_label) {
    const r = formatRange(range.low, range.high, range.unit);
    if (r) return `${range.metric_label}: ${r}`;
  }
  const savings = t.impact?.annual_savings;
  if (savings) {
    if (typeof savings.high === "number" && savings.high > 0) {
      const low = formatCurrency(savings.low);
      const high = formatCurrency(savings.high);
      if (low && high) return `${low}–${high}/yr`;
      if (high) return `${high}/yr`;
    }
    const expected = formatCurrency(savings.expected);
    if (expected) return `${expected}/yr`;
  }
  return "—";
}

export function rowFromDecision(id: string, payload: unknown): WorkspaceDecisionRow {
  const analysis = ((payload ?? {}) as { analysis?: any }).analysis ?? {};
  const decision = analysis.decision ?? {};
  const recs = Array.isArray(decision.recommendations) ? decision.recommendations : [];
  const top = recs[0] ?? {};
  const summary = decision.assessment_summary ?? {};
  const problemStatement =
    typeof summary.problem_statement === "string" ? summary.problem_statement.trim() : "";
  const topTitle = typeof top.title === "string" ? top.title.trim() : "";
  const createdAt =
    typeof analysis.created_at === "string" && analysis.created_at
      ? analysis.created_at
      : typeof decision.created_at === "string" && decision.created_at
        ? decision.created_at
        : typeof decision.generated_at === "string" && decision.generated_at
          ? decision.generated_at
          : null;

  return {
    id,
    title: problemStatement || topTitle || "Operational decision",
    businessFunction:
      typeof summary.business_function === "string" && summary.business_function
        ? summary.business_function
        : "—",
    recommendation: topTitle || "Recommendation available",
    // Persisted records carry no ownership data; show an explicit placeholder.
    owner: "—",
    status: workspaceStatusFromAnalysis(analysis),
    createdAt,
    expectedImpact: expectedImpactFromTop(top),
    nextAction:
      typeof top.next_validation_step?.action === "string"
        ? top.next_validation_step.action
        : "Review the recommendation",
  };
}

/** Minimal row when a persisted record cannot be loaded (kept honest). */
export function fallbackRow(entry: DecisionRegistryEntry): WorkspaceDecisionRow {
  return {
    id: entry.id,
    title: "Operational decision",
    businessFunction: "—",
    recommendation: "Recommendation available",
    owner: "—",
    status: "under_review",
    createdAt: entry.createdAt || null,
    expectedImpact: "—",
    nextAction: "Review the recommendation",
  };
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

// Executive-communication helpers for the Decision Brief. The Decision
// Engine reasons; these helpers communicate. Every function outputs
// business language, not internal engine terminology.

import type { DecisionRec, DefensibilityCheck } from "@/lib/decision-package";

export function cleanProblem(problem: string | undefined): string {
  if (!problem) return "";
  return problem.replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim();
}

/**
 * Executive summary — one paragraph answer to "What should we do?"
 * No internal terminology. Reads like a McKinsey one-liner.
 */
export function buildExecutiveSummary(
  top: DecisionRec,
  meta: any,
  library: number | null
): string {
  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const lib = library
    ? `${library.toLocaleString("en-US")} implementation records`
    : "a growing library of implementation records";

  const lines: string[] = [];
  const title = top.title || "this intervention";

  if (total > 0) {
    lines.push(
      `Compass recommends ${title} as the strongest option for this workflow.`
    );
    const detail: string[] = [];
    if (orgs) detail.push(`across ${orgs} organizations`);
    detail.push(`drawn from ${lib}`);
    lines.push(detail.join(", ") + ".");
  } else {
    lines.push(
      `${title} ranks first on the criteria applied against the evidence available.`
    );
  }

  if (top.rationale) {
    lines.push(top.rationale);
  }

  return lines.join(" ");
}

/** Three cards for "Why this is the best decision." */
export interface WhyCard {
  title: string;
  bullets: string[];
}

export function buildWhyCards(
  top: DecisionRec,
  summary: any
): WhyCard[] {
  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = (top.outcome_ranges || []).filter((r) => r.directly_comparable).length;
  const alts = (top.alternatives_considered || []).length;

  const cards: WhyCard[] = [];

  // Card 1 — comparable organizations
  if (total > 0) {
    cards.push({
      title: "Comparable organizations",
      bullets: [
        `${total} organization${total > 1 ? "s" : ""} with similar workflows successfully implemented ${top.title || "this intervention"}.`,
        ...(top.comparable_implementations || [])
          .filter((c) => c.outcome_summary || c.observed_outcome)
          .slice(0, 1)
          .map((c) => `${c.organization}: ${(c.outcome_summary || c.observed_outcome || "").replace(/;/g, " · ")}`),
      ],
    });
  }

  // Card 2 — why it beat the alternatives
  if (alts > 0) {
    cards.push({
      title: "Why it beat the alternatives",
      bullets: [
        `${alts} alternative${alts > 1 ? "s" : ""} evaluated — this option ranked first on implementation evidence, operational fit, and organizational readiness.`,
        (top.alternatives_considered || [])
          .slice(0, 2)
          .map((a) => `${a.family} — ${a.reason}`),
      ].flat().filter(Boolean) as string[],
    });
  }

  // Card 3 — observed business outcomes
  if (orgs > 0) {
    cards.push({
      title: "Observed business outcomes",
      bullets: (top.outcome_ranges || [])
        .filter((r) => r.directly_comparable)
        .slice(0, 3)
        .map((r) => {
          const v = r.median != null ? `${r.median}%` : r.low != null && r.high != null ? `${r.low}–${r.high}%` : "";
          return `${r.metric_label || "Metric"}: ${v} improvement in comparable implementations.`;
        }),
    });
  }

  // Fallback card
  if (cards.length === 0) {
    cards.push({
      title: "Why this recommendation",
      bullets: [
        `This intervention ranks highest against the evidence criteria applied.`,
        total > 0
          ? `${total} comparable implementations were evaluated.`
          : "The recommendation is based on the best available evidence.",
      ],
    });
  }

  return cards;
}

/** Decision confidence translated into explanatory factors. */
export function buildConfidenceExplanation(
  top: DecisionRec
): { label: string; present: boolean }[] {
  const total = top.evidence_summary?.total_comparables || 0;
  const outcomes = (
    top.outcome_ranges || []
  ).filter((r) => r.directly_comparable).length;
  const gaps = (top.information_gaps || []).length;
  const risks = (top.risks || []).length;

  return [
    { label: "Comparable implementations identified", present: total > 0 },
    { label: "Measurable outcomes observed", present: outcomes > 0 },
    { label: "Implementation risks identified", present: risks > 0 },
    { label: "Success criteria defined", present: !!top.next_validation_step },
    { label: "Additional baseline data requested", present: gaps > 0 },
  ];
}

/** Impact KPIs with business labels. */
export interface ImpactKpi {
  label: string;
  value: string;
  caption: string;
}

export function buildImpactKpis(top: DecisionRec): ImpactKpi[] {
  const es = top.evidence_summary || {};
  const total = es.total_comparables || 0;
  const score = top.confidence?.score != null ? Math.round(top.confidence.score * 100) : null;

  const kpis: ImpactKpi[] = [];

  // Operational improvement
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  if (ranges.length > 0) {
    const r = ranges[0];
    const v = r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "";
    const u =
      r.unit === "currency" ? " $" : r.unit === "%" ? "%" : "";
    kpis.push({
      label: "Expected operational improvement",
      value: `${v}${u}`,
      caption: `${r.metric_label || "outcome"} · observed in ${r.sample_size || 0} comparable implementations`,
    });
  } else {
    kpis.push({
      label: "Expected operational improvement",
      value: "—",
      caption: "Outcomes not quantified in retrieved records",
    });
  }

  // Implementation timeline
  const tl = top.impact?.implementation_timeline;
  if (tl?.min_weeks && tl?.max_weeks) {
    const toMonths = (w: number) => (w > 8 ? `${Math.round(w / 4.33)} months` : `${w} weeks`);
    kpis.push({ label: "Implementation timeline", value: `${toMonths(tl.min_weeks)}–${toMonths(tl.max_weeks)}`, caption: "estimate" });
  } else {
    kpis.push({ label: "Implementation timeline", value: "TBD", caption: "estimate" });
  }

  // Evidence basis
  kpis.push({
    label: "Evidence basis",
    value: total ? String(total) : "—",
    caption: total === 1 ? "comparable implementation" : "comparable implementations",
  });

  // Decision confidence
  kpis.push({
    label: "Decision confidence",
    value: top.confidence?.label || "—",
    caption: score != null ? `Based on ${total} comparable organizations` : "",
  });

  return kpis;
}

/** Risk items with business impact framing. */
export interface RiskItem {
  title: string;
  explanation: string;
  mitigation?: string;
}

export function buildRiskItems(top: DecisionRec): RiskItem[] {
  return (top.risks || []).map((r) => ({
    title: r.title || "Unnamed risk",
    explanation: r.explanation || "",
    mitigation: r.mitigation,
  }));
}

/** Unknown items — information gaps framed as what leadership should know. */
export interface UnknownItem {
  title: string;
  why: string;
}

export function buildUnknownItems(top: DecisionRec): UnknownItem[] {
  const gaps = top.information_gaps || [];
  if (gaps.length === 0) return [];
  return gaps.slice(0, 3).map((g) => ({
    title: g.title || "Missing information",
    why: g.explanation || "Without this information, the recommendation may shift.",
  }));
}

/** Assumptions that could materially change the recommendation. */
export function buildAssumptionItems(
  top: DecisionRec
): { title: string; explanation: string }[] {
  return (top.assumptions_detail || []).slice(0, 3).map((a) => ({
    title: a.title || "Assumption",
    explanation: a.explanation || "",
  }));
}

/** Defensibility translated into 5 executive bullet points. */
export function defensibilitySummary(
  checks: DefensibilityCheck[]
): { label: string; ok: boolean }[] {
  const map: Record<string, string> = {
    problem: "Comparable organizations identified",
    intervention: "Alternative approaches evaluated",
    comparables: "Implementation evidence available",
    implementation: "Implementation patterns identified",
    outcomes: "Measured outcomes available",
    risk: "Known implementation risks identified",
    measurement: "Success metrics defined",
    gaps: "Critical assumptions identified",
  };
  return checks.map((c) => ({
    label: map[c.key] || c.label,
    ok: c.ok,
  }));
}

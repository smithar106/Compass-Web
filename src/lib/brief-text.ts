// Shared copy helpers for the Executive Decision Brief. Both the in-product
// result and the PDF use these so the wording is consistent and sensible.

import type { DecisionRec } from "@/lib/decision-package";

/** Strip a leading "Department: " prefix from a problem statement. */
export function cleanProblem(problem: string | undefined): string {
  if (!problem) return "";
  return problem.replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim();
}

/**
 * Build the A1/A2/A3 recommendation reasons. Each key is a distinct,
 * readable claim rather than repeated boilerplate.
 */
export function buildRecommendationReasons(top: DecisionRec, summary: any): { key: string; text: string }[] {
  const reasons: { key: string; text: string }[] = [];
  const total = top.evidence_summary?.total_comparables || 0;
  const support = top.why_ranked_first?.supporting_reasons || top.why_it_ranked_here || [];
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);

  // A1 — why this problem
  const problem = cleanProblem(summary?.problem_statement) || top.rationale;
  reasons.push({
    key: "A1",
    text: problem
      ? `Why this problem: ${problem}`
      : "Why this problem: This workflow is a material cost, time, or quality driver.",
  });

  // A2 — why this intervention
  if (support.length > 0) {
    reasons.push({ key: "A2", text: `Why this intervention: ${support[0]}` });
  } else if (total > 0) {
    reasons.push({ key: "A2", text: `Why this intervention: ${total} comparable implementations support this approach.` });
  } else {
    reasons.push({ key: "A2", text: "Why this intervention: It ranks highest on the criteria Compass applies." });
  }

  // A3 — what the evidence shows
  if (ranges.length > 0) {
    const r = ranges[0];
    const value = r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "";
    reasons.push({
      key: "A3",
      text: `What the evidence shows: comparable implementations report ${value}${r.unit === "%" ? "%" : ""} improvement in ${r.metric_label || "the metric"}.`,
    });
  } else if (support.length > 1) {
    reasons.push({ key: "A3", text: `What the evidence shows: ${support[1]}` });
  } else {
    reasons.push({ key: "A3", text: "What the evidence shows: outcomes are tracked against a baseline before scaling." });
  }

  return reasons.slice(0, 3);
}

/** Honest executive summary. Avoids claiming "highest confidence" for a preliminary result. */
export function buildExecutiveSummary(top: DecisionRec, meta: any, library: number | null): string {
  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const libraryLabel = library ? `${library.toLocaleString("en-US")} verified implementations` : "a growing library of verified implementations";
  const title = top.title || "this intervention";
  if (total > 0) {
    return `Compass recommends ${title} as the top-ranked option. It is grounded in ${total} comparable implementation${total > 1 ? "s" : ""} drawn from ${libraryLabel}${orgs ? `, across ${orgs} organizations` : ""}.`;
  }
  return `Compass recommends ${title} as the top-ranked option based on the evidence criteria applied.`;
}

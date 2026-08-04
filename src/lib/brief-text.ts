// Executive communication helpers for the Decision Brief.
// Every output reads like a McKinsey memo or board-level investment proposal.
// No engine terminology. No internal scoring. No algorithm explanation.

import type { DecisionRec, DefensibilityCheck } from "@/lib/decision-package";

// ---- Section 1: Executive Summary ---------------------------------------

export function businessSummary(top: DecisionRec, meta: any, library: number | null): string {
  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const title = top.title || "this intervention";

  let base = `Compass recommends implementing ${title} as the strongest option for this workflow.`;
  if (total > 0) {
    const org = orgs
      ? `across ${orgs} organizations${library ? ` in a library of ${library.toLocaleString("en-US")} implementation records` : ""}`
      : "";
    base += ` The recommendation is grounded in ${total} similar cases${org ? `, ${org}` : ""}.`;
  }
  if (top.rationale) {
    base += ` ${top.rationale}`;
  }
  return base;
}

export interface ExecutiveKpi {
  label: string;
  value: string;
  caption: string;
}

export function executiveKpis(top: DecisionRec): ExecutiveKpi[] {
  const kpis: ExecutiveKpi[] = [];

  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  if (ranges.length > 0) {
    const r = ranges[0];
    const v = r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "";
    const metric = (r.metric_label || "").replace(/^Call Volume$/i, "manual workload").replace(/^Processing time$/i, "processing time").replace(/^processing cost$/i, "processing cost");
    kpis.push({
      label: "Expected business impact",
      value: v ? `${v}${r.unit !== "%" && r.unit !== "currency" ? "" : r.unit !== "%" ? "" : "%"}${r.unit === "currency" ? " savings" : ""}${r.unit === "%" ? " improvement" : ""}` : "—",
      caption: metric ? `Observed in ${r.sample_size || 0} similar cases` : "Based on similar cases",
    });
  } else {
    kpis.push({ label: "Expected business impact", value: "—", caption: "Outcomes not yet quantified" });
  }

  const tl = top.impact?.implementation_timeline;
  if (tl?.min_weeks && tl?.max_weeks) {
    const fmt = (w: number) => w > 8 ? `${Math.round(w / 4.33)} months` : `${w} weeks`;
    kpis.push({ label: "Implementation timeline", value: `${fmt(tl.min_weeks)}–${fmt(tl.max_weeks)}`, caption: "estimate" });
  } else {
    kpis.push({ label: "Implementation timeline", value: "TBD", caption: "" });
  }

  const gaps = (top.information_gaps || []).length;
  const risks = (top.risks || []).length;
  const total = top.evidence_summary?.total_comparables || 0;
  kpis.push({
    label: "Implementation complexity",
    value: gaps > 0 || risks > 0 || total < 3 ? "Moderate" : "Low to moderate",
    caption: gaps > 0 ? `Additional operational data requested` : risks > 0 ? `Known risks identified` : `${total} similar cases evaluated`,
  });

  return kpis;
}

// ---- Section 2: Why this is the right decision ---------------------------

export interface RationaleCard {
  title: string;
  body: string;
}

export function businessRationale(top: DecisionRec, summary: any): RationaleCard[] {
  const cards: RationaleCard[] = [];
  const total = top.evidence_summary?.total_comparables || 0;
  const comps = top.comparable_implementations || [];

  // Organizations facing similar challenges
  if (total > 0) {
    const orgNames = comps
      .slice(0, 2)
      .map((c) => c.organization)
      .filter(Boolean)
      .join(" and ");
    cards.push({
      title: "Organizations facing similar challenges",
      body: orgNames
        ? `${orgNames} implemented ${top.title || "this intervention"} in comparable operational contexts. The approach has been validated across different industries and operating models.`
        : `${total} organizations facing similar operational challenges implemented ${top.title || "this intervention"} successfully.`,
    });
  }

  // Why this recommendation won
  const alts = (top.alternatives_considered || []).length;
  cards.push({
    title: "Why this recommendation won",
    body: alts > 0
      ? `This option was ranked first because it offers a better balance of implementation evidence, operational fit, and organizational readiness compared to ${alts} alternative${alts > 1 ? "s" : ""} evaluated.`
      : `This option ranked highest against the criteria applied: evidence of success in similar organizations, alignment with operational goals, and clarity of the implementation path.`,
  });

  // Observed outcomes
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  if (ranges.length > 0) {
    const r = ranges[0];
    const metric = (r.metric_label || "").replace(/^Call Volume$/i, "manual workload");
    const v = r.median != null ? `${r.median}%` : r.low != null && r.high != null ? `${r.low}% to ${r.high}%` : "";
    cards.push({
      title: "Observed outcomes",
      body: v
        ? `Organizations implementing this intervention reported approximately ${v} improvement in ${metric.toLowerCase()}.`
        : `${r.sample_size || 0} organizations reported measurable outcomes.`,
    });
  }

  // Fallback
  if (cards.length === 0) {
    cards.push({
      title: "Why this recommendation",
      body: `This intervention ranks highest against the evidence criteria applied. The recommendation is based on the best available implementation data.`,
    });
  }

  return cards;
}

// ---- Section 3: Risks and unknowns ---------------------------------------

export interface RiskItem {
  title: string;
  body: string;
  mitigation?: string;
}

export function riskItems(top: DecisionRec): RiskItem[] {
  return (top.risks || []).slice(0, 3).map((r) => ({
    title: r.title || "Risk",
    body: r.explanation || "",
    mitigation: r.mitigation,
  }));
}

export interface UnknownItem {
  title: string;
  why: string;
}

export function unknownItems(top: DecisionRec): UnknownItem[] {
  return (top.information_gaps || []).slice(0, 3).map((g) => ({
    title: g.title || "Missing information",
    why: g.explanation || `Without this information, the recommendation may need to be adjusted.`,
  }));
}

export interface AssumptionItem {
  title: string;
  body: string;
}

export function assumptionItems(top: DecisionRec): AssumptionItem[] {
  return (top.assumptions_detail || []).slice(0, 3).map((a) => ({
    title: a.title || "Assumption",
    body: a.explanation || "",
  }));
}

// ---- Section 4: Implementation roadmap -----------------------------------

export interface RoadmapStep {
  label: string;
  detail: string;
  owner: string;
}

export function implementationRoadmap(top: DecisionRec): RoadmapStep[] {
  const steps: RoadmapStep[] = [];

  steps.push({
    label: "Baseline measurement",
    detail: top.next_validation_step?.success_criteria || "Establish current performance metrics before implementation begins.",
    owner: "Operations lead",
  });

  steps.push({
    label: "Configuration and build",
    detail: "Configure the solution and integrate with existing systems.",
    owner: "Implementation team",
  });

  steps.push({
    label: "Pilot and validation",
    detail: top.next_validation_step?.action || "Validate against the agreed baseline before proceeding to full deployment.",
    owner: "Operations lead + Compass",
  });

  steps.push({
    label: "Full deployment",
    detail: "Roll out across the organization once validation criteria are met.",
    owner: "Implementation partner or internal team",
  });

  return steps;
}

// ---- Section 5: Evidence — organization stories --------------------------

export interface EvidenceStory {
  organization: string;
  problem: string;
  solution: string;
  outcome: string;
}

export function evidenceStories(top: DecisionRec): EvidenceStory[] {
  return (top.comparable_implementations || []).slice(0, 3).map((c) => ({
    organization: c.organization || "Verified organization",
    problem: summaryProblem(top),
    solution: c.intervention || top.title || "A comparable intervention",
    outcome: (c.outcome_summary || c.observed_outcome || "Measurable improvements observed").replace(/;/g, " · "),
  }));
}

function summaryProblem(top: DecisionRec): string {
  const cat = (top.category || "").replace(/_/g, " ").toLowerCase();
  return cat ? `A ${cat} challenge` : "A similar operational challenge";
}

// ---- Section 6: Other options considered ---------------------------------

export interface EvaluatedOption {
  title: string;
  tradeoff: string;
}

export function evaluatedOptions(top: DecisionRec): EvaluatedOption[] {
  return (top.alternatives_considered || []).slice(0, 3).map((a) => ({
    title: a.family || "An alternative approach",
    tradeoff: a.reason || "Does not offer the same combination of evidence and operational fit.",
  }));
}

// ---- Section 7: Decision Notes -------------------------------------------

export function decisionNotes(g: { key: string; note: string }): string {
  const base = g.note
    .replace(/Derived live from/g, "Derived from")
    .replace(/comparable implementations/g, "similar cases")
    .replace(/evidence graph/g, "implementation library")
    .replace(/deterministic scoring/g, "evidence criteria")
    .replace(/average similarity/g, "contextual match");
  return `${base} Outcomes shown are observed in similar organizations and are not guarantees.`;
}

// ---- Defensibility (used in "Other options" section) ----------------------

export function defensibilityItems(
  checks: DefensibilityCheck[]
): { label: string; ok: boolean }[] {
  const map: Record<string, string> = {
    problem: "Organizations facing similar challenges identified",
    intervention: "Alternative approaches evaluated",
    comparables: "Implementation evidence available",
    implementation: "Implementation patterns identified",
    outcomes: "Measured outcomes available in similar cases",
    risk: "Known risks identified",
    measurement: "Success criteria defined",
    gaps: "Key assumptions identified",
  };
  return checks.map((c) => ({
    label: map[c.key] || c.label,
    ok: c.ok,
  }));
}

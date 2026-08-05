// Executive Decision Brief — conviction-driven text helpers.
// Cincinnati pattern: bold cards with numbers, short text, no repetition.

import type { DecisionRec } from "@/lib/decision-package";

// ---- Opening and closing — 2-3 sentences each -------------------------

export function decisionSummary(top: DecisionRec, summary: any): string {
  const title = top.title || "this approach";
  const problem = (summary?.problem_statement || "").replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim();
  const problemContext = problem
    ? `${problem} creates unnecessary manual effort and limits the team's ability to scale.`
    : `The current workflow limits operational capacity.`;
  return `We recommend approving ${title}${problem ? ` for ${problem}` : ""}. ${problemContext}`;
}

export function closingRecommendation(top: DecisionRec): string {
  const title = top.title || "this recommendation";
  return `We recommend approving ${title}. Complete a baseline, validate against the criteria below, and confirm implementation readiness before full deployment.`;
}

export function businessCaseText(top: DecisionRec, summary: any): string {
  const title = top.title || "this approach";
  const problem = (summary?.problem_statement || "").replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim();
  if (problem) return `Organizations in ${problem} face recurring operational constraints that compound over time. ${title} addresses this directly, with measurable outcomes observed in comparable implementations.`;
  return `${title} resolves the operational constraints identified in the current-state analysis. Comparable organizations have implemented similar interventions with documented results.`;
}

export function alternativesRejected(top: DecisionRec): string {
  return (top.alternatives_considered || []).length > 0
    ? `Alternatives including ${(top.alternatives_considered || []).slice(0, 2).map((a: any) => a.title || a.name || "alternative approaches").join(" and ")} were evaluated and set aside due to lower expected impact on the measured outcome.`
    : "Alternatives were evaluated against expected impact on the primary outcome and set aside for insufficient measurable effect.";
}

// ---- KPI cards — bold numbers, minimal text (Cincinnati pattern) ------

export interface ExecutiveKpi {
  label: string;
  value: string;
  caption: string;
}

export function convictionKpis(top: DecisionRec): ExecutiveKpi[] {
  const kpis: ExecutiveKpi[] = [];
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  const gaps = (top.information_gaps || []).length;
  const risks = (top.risks || []).length;
  const tl = top.impact?.implementation_timeline;

  if (ranges.length > 0) {
    const r = ranges[0];
    const metric = (r.metric_label || "").replace(/Call Volume/i, "manual processing effort").replace(/Processing time/i, "processing time").replace(/processing cost/i, "processing cost").toLowerCase();
    const v = r.median != null ? `~${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "";
    kpis.push({
      label: "Expected business impact",
      value: v || "—",
      caption: `${v || "Measurable"} improvement in ${metric}.`,
    });
  } else {
    kpis.push({ label: "Expected business impact", value: "—", caption: "Impact will be measured against a baseline." });
  }

  if (tl?.min_weeks && tl?.max_weeks) {
    const fmt = (w: number) => (w > 8 ? `${Math.round(w / 4.33)} months` : `${w} weeks`);
    kpis.push({ label: "Time to impact", value: `${fmt(tl.min_weeks)}–${fmt(tl.max_weeks)}`, caption: "Similar implementations reached measurable results within this window." });
  } else {
    kpis.push({ label: "Time to impact", value: "TBD", caption: "" });
  }

  kpis.push({
    label: "Implementation confidence",
    value: gaps > 0 || risks > 0 ? "Moderate" : "High",
    caption: gaps > 0 ? "Additional operational data requested to finalize the estimate." : risks > 0 ? "Risks are understood and manageable." : "Established in comparable organizations.",
  });

  return kpis;
}

// ---- Evidence — bold org name + short outcome line ----------------------

export interface EvidenceStory {
  organization: string;
  outcome: string;
}

export function evidenceStories(top: DecisionRec): EvidenceStory[] {
  return (top.comparable_implementations || []).slice(0, 3).map((c) => ({
    organization: c.organization || "A comparable organization",
    outcome: (c.outcome_summary || c.observed_outcome || "Measurable operational improvements observed.").replace(/;/g, ". "),
  }));
}

// ---- Risks, unknowns, assumptions ----------------------------------------

export interface RiskItem { title: string; mitigation?: string; }
export function riskItems(top: DecisionRec): RiskItem[] { return (top.risks || []).slice(0, 3).map(r => ({ title: r.title || "Risk", mitigation: r.mitigation || r.explanation })); }

export interface UnknownItem { title: string; why: string; }
export function unknownItems(top: DecisionRec): UnknownItem[] { return (top.information_gaps || []).slice(0, 3).map(g => ({ title: g.title || "Missing information", why: g.explanation || "Required to validate the estimate." })); }

export interface AssumptionItem { title: string; }
export function assumptionItems(top: DecisionRec): AssumptionItem[] { return (top.assumptions_detail || []).slice(0, 3).map(a => ({ title: a.title || "Assumption" })); }

// ---- Implementation (4-step roadmap) --------------------------------------

export interface RoadmapStep { label: string; detail: string; owner: string; }
export function implementationRoadmap(top: DecisionRec): RoadmapStep[] {
  return [
    { label: "Baseline measurement", detail: top.next_validation_step?.success_criteria || "Establish current performance metrics.", owner: "Operations lead" },
    { label: "Configuration and build", detail: "Configure the solution and integrate with existing systems.", owner: "Implementation team" },
    { label: "Pilot and validation", detail: "Run a controlled pilot. Compare results against the baseline before full deployment.", owner: "Operations lead" },
    { label: "Full deployment", detail: "Roll out once validation criteria are met.", owner: "Implementation partner or internal team" },
  ];
}

// ---- Notes ----------------------------------------------------------------

export function decisionNotes(): string { return "Outcomes shown are observed in comparable organizations and are not guarantees. Estimates will be refined as additional implementation data is collected."; }

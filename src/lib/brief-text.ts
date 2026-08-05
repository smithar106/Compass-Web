// Executive Decision Brief — conviction-driven text helpers.
// Every sentence reads like someone who studied the evidence
// and is now prepared to make a recommendation.

import type { DecisionRec } from "@/lib/decision-package";

// ---- Opening paragraph — why change, why now ---------------------------

export function decisionSummary(top: DecisionRec, summary: any): string {
  const title = top.title || "this approach";
  const problem = (summary?.problem_statement || "").replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim();
  const alts = (top.alternatives_considered || []).length;
  const total = top.evidence_summary?.total_comparables || 0;

  const problemContext = problem
    ? `${problem} creates unnecessary manual effort and limits the team's ability to scale.`
    : `The current workflow limits operational capacity.`;

  const evidenceContext = total > 0
    ? `Evidence from similar implementations suggests ${title} can materially improve processing efficiency${alts > 0 ? ` while managing implementation risk better than the ${alts} alternative${alts > 1 ? "s" : ""} evaluated` : ""}.`
    : `${title} offers the strongest balance of expected business value and implementation readiness.`;

  return `We recommend approving ${title}${problem ? ` for ${problem}` : ""}. ${problemContext} ${evidenceContext}`;
}

// ---- KPI cards — business conviction, not metrics --------------------

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
      caption: `${v || "Measurable"} improvement in ${metric}, freeing the team for higher-value work.`,
    });
  } else {
    kpis.push({ label: "Expected business impact", value: "—", caption: "Impact will be measured against a baseline before build." });
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
    caption: gaps > 0 ? "The technology is proven. Additional operational data is requested to finalize the impact estimate." : risks > 0 ? "Risks are understood and manageable." : "The approach is well-established in comparable organizations.",
  });

  return kpis;
}

// ---- Why this decision — conviction cards --------------------------------

export interface ConvictionCard {
  title: string;
  body: string;
}

export function convictionCards(top: DecisionRec): ConvictionCard[] {
  const cards: ConvictionCard[] = [];
  const total = top.evidence_summary?.total_comparables || 0;
  const comps = top.comparable_implementations || [];

  if (total > 0) {
    const orgNames = comps.slice(0, 2).map((c) => c.organization).filter(Boolean);
    cards.push({
      title: "Who has done this",
      body: orgNames.length > 0
        ? `${orgNames.join(" and ")} each implemented this approach and saw meaningful improvement.`
        : `${total} organizations with similar constraints implemented this successfully.`,
    });
  }

  const alts = (top.alternatives_considered || []).length;
  cards.push({
    title: "Why this option",
    body: alts > 0
      ? `Balances expected business value, implementation effort, and operational risk better than the ${alts} alternatives evaluated.`
      : `Best balance of business value, implementation effort, and organizational readiness.`,
  });

  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  if (ranges.length > 0) {
    const r = ranges[0];
    const metric = (r.metric_label || "").replace(/Call Volume/i, "manual workload").toLowerCase();
    const v = r.median != null ? `~${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "";
    cards.push({ title: "Expected outcome", body: v ? `${v} improvement in ${metric} across comparable implementations.` : "Measurable improvement across comparable implementations." });
  }

  return cards.length > 0 ? cards : [{ title: "Recommendation basis", body: "Ranks highest against the evidence criteria applied." }];
}

// ---- Evidence — narrative stories, not database rows ----------------------

export interface EvidenceStory {
  organization: string;
  whatHappened: string;
  outcome: string;
  whyItMatters: string;
}

export function evidenceStories(top: DecisionRec): EvidenceStory[] {
  const cat = (top.category || "").replace(/_/g, " ");
  return (top.comparable_implementations || []).slice(0, 3).map((c) => {
    const outcome = (c.outcome_summary || c.observed_outcome || "Measurable operational improvements observed.").replace(/;/g, ". ");
    // Build a unique takeaway from this organization's actual outcome.
    const metrics = outcome.match(/(\d+%|\d+)[\s\w]*/g) || [];
    const takeaway = metrics.length > 0
      ? `Achieved ${metrics.slice(0, 2).join(" and ")} in measurable outcomes.`
      : `Achieved measurable operational improvements.`;
    return {
      organization: c.organization || "A comparable organization",
      whatHappened: `${c.organization || "This organization"} deployed ${c.intervention || top.title || "a comparable intervention"}.`,
      outcome,
      whyItMatters: takeaway,
    };
  });
}

// ---- Risks, unknowns, assumptions -----------------------------------------

export interface RiskItem { title: string; mitigation?: string; }
export function riskItems(top: DecisionRec): RiskItem[] { return (top.risks || []).slice(0, 3).map(r => ({ title: r.title || "Risk", mitigation: r.mitigation || r.explanation })); }

export interface UnknownItem { title: string; why: string; }
export function unknownItems(top: DecisionRec): UnknownItem[] { return (top.information_gaps || []).slice(0, 3).map(g => ({ title: g.title || "Missing information", why: g.explanation || "Required to validate the estimate." })); }

export interface AssumptionItem { title: string; }
export function assumptionItems(top: DecisionRec): AssumptionItem[] { return (top.assumptions_detail || []).slice(0, 3).map(a => ({ title: a.title || "Assumption" })); }

// ---- Implementation -------------------------------------------------------

export interface RoadmapStep { label: string; detail: string; owner: string; }
export function implementationRoadmap(top: DecisionRec): RoadmapStep[] {
  return [
    { label: "Baseline measurement", detail: top.next_validation_step?.success_criteria || "Establish current performance metrics.", owner: "Operations lead" },
    { label: "Configuration and build", detail: "Configure the solution and integrate with existing systems.", owner: "Implementation team" },
    { label: "Pilot and validation", detail: "Run a controlled pilot. Compare results against the baseline before proceeding to full deployment.", owner: "Operations lead" },
    { label: "Full deployment", detail: "Roll out once validation criteria are met.", owner: "Implementation partner or internal team" },
  ];
}

// ---- Notes ----------------------------------------------------------------

export function decisionNotes(): string { return "Outcomes shown are observed in comparable organizations and are not guarantees. Estimates will be refined as additional implementation data is collected."; }

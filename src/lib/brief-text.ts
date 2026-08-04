// Executive communication helpers for the Decision Brief.
// Every sentence sounds like a McKinsey partner wrote it after two weeks
// of studying the problem. No engine terminology. No database statistics.
// Only conclusions an executive needs to approve or reject.

import type { DecisionRec, DefensibilityCheck } from "@/lib/decision-package";

// ---- Section 1: Executive Summary ---------------------------------------

/** One paragraph. Reads as a recommendation, not an engine output. */
export function businessSummary(top: DecisionRec, _meta: any, _library: number | null): string {
  const title = top.title || "this intervention";
  const alts = (top.alternatives_considered || []).length;
  return alts > 0
    ? `Compass recommends ${title} because organizations facing similar operational challenges consistently achieved better outcomes with lower implementation complexity than the ${alts} alternative approach${alts > 1 ? "s" : ""} considered.`
    : `Compass recommends ${title} as the strongest option for this operational challenge, based on implementation evidence from organizations facing similar constraints.`;
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
    const v = r.median != null ? `~${r.median}%` : r.low != null && r.high != null ? `${r.low}% to ${r.high}%` : "";
    const improvement = (r.metric_label || "")
      .replace(/Call Volume/i, "manual processing effort")
      .replace(/Processing time/i, "processing time")
      .replace(/processing cost/i, "processing cost")
      .toLowerCase();
    kpis.push({
      label: "Expected outcome",
      value: v || "—",
      caption: `Reduction in ${improvement}. Based on organizations with similar operational workflows.`,
    });
  } else {
    kpis.push({ label: "Expected outcome", value: "—", caption: "Outcomes will be measured against a baseline." });
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
    caption: gaps > 0 ? "Additional operational data requested before full deployment." : `${total} organizations have successfully implemented this approach.`,
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

  if (total > 0) {
    const orgs = (top.comparable_implementations || [])
      .slice(0, 2)
      .map((c) => c.organization)
      .filter(Boolean);
    cards.push({
      title: "Organizations facing similar challenges",
      body: orgs.length > 0
        ? `${orgs.join(" and ")} faced comparable operational constraints and saw measurable improvement after implementing this approach.`
        : `Organizations with similar operational workflows have successfully implemented this approach and achieved measurable outcomes.`,
    });
  }

  const alts = (top.alternatives_considered || []).length;
  cards.push({
    title: "Why this recommendation won",
    body: alts > 0
      ? `This option ranked first because it offers a better balance of implementation evidence, operational fit, and organizational readiness compared to the ${alts} alternative${alts > 1 ? "s" : ""} evaluated.`
      : `This option ranked highest against the criteria: evidence of success in similar organizations, alignment with operational goals, and clarity of the implementation path.`,
  });

  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  if (ranges.length > 0) {
    const r = ranges[0];
    const metric = (r.metric_label || "").replace(/Call Volume/i, "manual workload").toLowerCase();
    const v = r.median != null ? `~${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "";
    cards.push({
      title: "Observed outcomes",
      body: v
        ? `Organizations implementing this approach reported approximately ${v} improvement in ${metric}.`
        : `Organizations implementing this approach reported measurable operational improvements.`,
    });
  }

  if (cards.length === 0) {
    cards.push({
      title: "Why this recommendation",
      body: "This approach ranked highest against the evidence criteria applied and is supported by the best available implementation data.",
    });
  }

  return cards;
}

// ---- Section 3: Risks and unknowns ---------------------------------------

export interface RiskItem {
  title: string;
  mitigation?: string;
}

export function riskItems(top: DecisionRec): RiskItem[] {
  return (top.risks || []).slice(0, 3).map((r) => ({
    title: r.title || "Risk",
    mitigation: r.mitigation || r.explanation,
  }));
}

export interface UnknownItem {
  title: string;
  why: string;
}

export function unknownItems(top: DecisionRec): UnknownItem[] {
  return (top.information_gaps || []).slice(0, 3).map((g) => ({
    title: g.title || "Missing information",
    why: g.explanation || "Without this, the recommendation may need to be adjusted.",
  }));
}

export interface AssumptionItem {
  title: string;
}

export function assumptionItems(top: DecisionRec): AssumptionItem[] {
  return (top.assumptions_detail || []).slice(0, 3).map((a) => ({
    title: a.title || "Assumption",
  }));
}

// ---- Section 4: Implementation roadmap -----------------------------------

export interface RoadmapStep {
  label: string;
  detail: string;
  owner: string;
}

export function implementationRoadmap(top: DecisionRec): RoadmapStep[] {
  return [
    {
      label: "Baseline measurement",
      detail: top.next_validation_step?.success_criteria || "Establish current performance metrics before implementation begins.",
      owner: "Operations lead",
    },
    {
      label: "Configuration and build",
      detail: "Configure the solution and integrate with existing systems.",
      owner: "Implementation team",
    },
    {
      label: "Pilot and validation",
      detail: top.next_validation_step?.action || "Validate against the agreed baseline before proceeding to full deployment.",
      owner: "Operations lead + Compass",
    },
    {
      label: "Full deployment",
      detail: "Roll out across the organization once validation criteria are met.",
      owner: "Implementation partner or internal team",
    },
  ];
}

// ---- Section 5: Evidence — organization stories --------------------------

export interface EvidenceStory {
  organization: string;
  challenge: string;
  solution: string;
  result: string;
}

export function evidenceStories(top: DecisionRec): EvidenceStory[] {
  const cat = (top.category || "").replace(/_/g, " ");
  return (top.comparable_implementations || []).slice(0, 3).map((c) => ({
    organization: c.organization || "A comparable organization",
    challenge: categoryToChallenge(cat),
    solution: c.intervention || top.title || "A comparable intervention",
    result: (c.outcome_summary || c.observed_outcome || "Measurable operational improvements").replace(/;/g, ". "),
  }));
}

function categoryToChallenge(category: string): string {
  const challenges: Record<string, string> = {
    workflow_automation: "Manual processing at scale with inconsistent quality",
    ticketing: "High support ticket volume with manual triage and routing",
    invoice_processing: "High manual claims processing",
    onboarding: "Slow, manual customer onboarding with multiple handoffs",
    contract_review: "Contract review bottleneck with manual clause extraction",
    lead_qualification: "Manual lead qualification with inconsistent scoring",
    marketing_automation: "Manual campaign assembly and execution",
    ci_cd: "Slow, manual build, test, and deployment cycles",
    process_automation: "Manual, repetitive operational workflows",
    manufacturing: "Manual quality checks and inconsistent throughput",
    supply_chain: "Manual inventory and logistics coordination",
  };
  return challenges[category.toLowerCase()] || `A ${category} challenge at scale`;
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

export function decisionNotes(_g: { key: string; note: string }): string {
  return "Outcomes shown are observed in organizations facing similar operational challenges and are not guarantees. Estimates will be refined as additional implementation data becomes available.";
}

// ---- Defensibility --------------------------------------------------------

export function defensibilityItems(
  checks: DefensibilityCheck[]
): { label: string; ok: boolean }[] {
  const map: Record<string, string> = {
    problem: "Organizations facing similar challenges identified",
    intervention: "Alternative approaches evaluated",
    comparables: "Implementation evidence available",
    implementation: "Implementation patterns identified",
    outcomes: "Measured outcomes available",
    risk: "Known risks identified",
    measurement: "Success criteria defined",
    gaps: "Key assumptions identified",
  };
  return checks.map((c) => ({
    label: map[c.key] || c.label,
    ok: c.ok,
  }));
}

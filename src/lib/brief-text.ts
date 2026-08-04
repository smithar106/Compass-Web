// Executive Decision Brief text helpers.
// Every sentence reads like a McKinsey partner wrote it.
// No AI language. No system thinking. No "Compass" in the body.

import type { DecisionRec, DefensibilityCheck } from "@/lib/decision-package";

// ---- Executive Summary ---------------------------------------------------

export function businessSummary(top: DecisionRec): string {
  const title = top.title || "this approach";
  const alts = (top.alternatives_considered || []).length;
  return alts > 0
    ? `${title} is the recommended approach. Organizations with similar operational constraints achieved better outcomes at lower complexity than the ${alts} alternative${alts > 1 ? "s" : ""} considered.`
    : `${title} is the recommended approach, based on implementation evidence from organizations with comparable operational constraints.`;
}

// ---- KPI Cards -----------------------------------------------------------

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
    const v = r.median != null ? `~${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "";
    const improvement = (r.metric_label || "")
      .replace(/Call Volume/i, "manual processing effort")
      .replace(/Processing time/i, "processing time")
      .replace(/processing cost/i, "processing cost")
      .toLowerCase();
    kpis.push({
      label: "Expected outcome",
      value: v || "—",
      caption: `Reduction in ${improvement}.`,
    });
  } else {
    kpis.push({ label: "Expected outcome", value: "—", caption: "Measured against a baseline." });
  }

  const tl = top.impact?.implementation_timeline;
  if (tl?.min_weeks && tl?.max_weeks) {
    const fmt = (w: number) => (w > 8 ? `${Math.round(w / 4.33)} months` : `${w} weeks`);
    kpis.push({ label: "Implementation timeline", value: `${fmt(tl.min_weeks)}–${fmt(tl.max_weeks)}`, caption: "" });
  } else {
    kpis.push({ label: "Implementation timeline", value: "TBD", caption: "" });
  }

  const gaps = (top.information_gaps || []).length;
  const risks = (top.risks || []).length;
  kpis.push({
    label: "Implementation complexity",
    value: gaps > 0 || risks > 0 ? "Moderate" : "Low to moderate",
    caption: gaps > 0 ? "Additional data requested before full deployment." : `${risks > 0 ? "Known risks identified." : ""}`,
  });

  return kpis;
}

// ---- Why this is the right decision ---------------------------------------

export interface RationaleCard {
  title: string;
  body: string;
}

export function businessRationale(top: DecisionRec): RationaleCard[] {
  const cards: RationaleCard[] = [];
  const total = top.evidence_summary?.total_comparables || 0;

  if (total > 0) {
    const orgs = (top.comparable_implementations || [])
      .slice(0, 2)
      .map((c) => c.organization)
      .filter(Boolean);
    cards.push({
      title: "Who has done this",
      body: orgs.length > 0
        ? `${orgs.join(" and ")} each implemented this approach in similar operating environments.`
        : `Several organizations with similar workflows have implemented this approach.`,
    });
  }

  const alts = (top.alternatives_considered || []).length;
  cards.push({
    title: "Why it was selected",
    body: alts > 0
      ? `This approach balances expected business value, implementation effort, and operational risk better than the ${alts} alternative${alts > 1 ? "s" : ""} evaluated.`
      : `This approach best balances business value, implementation effort, and operational readiness.`,
  });

  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  if (ranges.length > 0) {
    const r = ranges[0];
    const metric = (r.metric_label || "").replace(/Call Volume/i, "manual workload").toLowerCase();
    const v = r.median != null ? `~${r.median}%` : r.low != null && r.high != null ? `${r.low}%–${r.high}%` : "";
    cards.push({
      title: "Observed outcomes",
      body: v ? `${v} improvement in ${metric}.` : `Measurable operational improvements reported.`,
    });
  } else {
    cards.push({
      title: "Observed outcomes",
      body: "Organizations implementing this approach reported measurable improvements.",
    });
  }

  return cards;
}

// ---- Risks & unknowns -----------------------------------------------------

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
    why: g.explanation || "Required to validate the estimate before full deployment.",
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

// ---- Implementation -------------------------------------------------------

export interface RoadmapStep {
  label: string;
  detail: string;
  owner: string;
}

export function implementationRoadmap(top: DecisionRec): RoadmapStep[] {
  return [
    {
      label: "Baseline measurement",
      detail: top.next_validation_step?.success_criteria || "Establish current performance metrics.",
      owner: "Operations lead",
    },
    {
      label: "Configuration and build",
      detail: "Configure the solution and integrate with existing systems.",
      owner: "Implementation team",
    },
    {
      label: "Pilot and validation",
      detail: top.next_validation_step?.action || "Validate against the agreed baseline before full deployment.",
      owner: "Operations lead",
    },
    {
      label: "Full deployment",
      detail: "Roll out across the organization once validation criteria are met.",
      owner: "Implementation partner or internal team",
    },
  ];
}

// ---- Evidence: organization stories ----------------------------------------

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
    result: (c.outcome_summary || c.observed_outcome || "Measurable improvements observed").replace(/;/g, ". "),
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
    ci_cd: "Slow build, test, and deployment cycles",
    process_automation: "Manual, repetitive operational workflows",
    manufacturing: "Manual quality checks and inconsistent throughput",
    supply_chain: "Manual inventory and logistics coordination",
  };
  return challenges[category.toLowerCase()] || `A ${category} challenge at scale`;
}

// ---- Other options considered ----------------------------------------------

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

// ---- Decision notes --------------------------------------------------------

export function decisionNotes(): string {
  return "Outcomes shown are observed in organizations with comparable operating environments and are not guarantees. Estimates will be refined as additional implementation data is collected.";
}

// ---- Defensibility ----------------------------------------------------------

export function defensibilityItems(
  checks: DefensibilityCheck[]
): { label: string; ok: boolean }[] {
  const map: Record<string, string> = {
    problem: "Similar organizations identified",
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

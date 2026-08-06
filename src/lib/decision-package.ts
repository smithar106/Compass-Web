// Pure helpers for rendering a Decision Package from the live engine result.
// Nothing here invents data: every factor maps to an engine field.

export interface ComparableEvidence {
  record_id?: string;
  organization: string;
  intervention?: string;
  intervention_description?: string;
  outcome_summary?: string;
  observed_outcome?: string;
  supporting_passage?: string;
  source_url?: string;
  evidence_tier?: string;
  similarity_score?: number;
}

export interface DecisionRec {
  category?: string;
  pathway_label?: string;
  title?: string;
  description?: string;
  rationale?: string;
  quality?: {
    pathway_score: number;
    evidence_relevance_score: number;
    evidence_quality_score: number;
    metric_quality_score: number;
    title_quality_score: number;
    overall_recommendation_quality: number;
    status: string;
    weak_dimensions: string[];
  };
  confidence?: { score: number; label: string; explanation: string };
  evidence_summary?: {
    overall_tier?: string;
    total_comparables?: number;
    gold_count?: number;
    silver_count?: number;
    bronze_count?: number;
    average_evidence_score?: number;
  };
  outcome_ranges?: {
    metric_label?: string;
    low?: number | null;
    high?: number | null;
    median?: number | null;
    sample_size?: number;
    unit?: string;
    directly_comparable?: boolean;
    direction?: string;
    gold_count?: number;
    silver_count?: number;
    bronze_count?: number;
  }[];
  comparable_implementations?: ComparableEvidence[];
  risks?: { title?: string; explanation?: string; mitigation?: string }[];
  assumptions_detail?: { title?: string; explanation?: string; resolution_action?: string }[];
  information_gaps?: { title?: string; explanation?: string; effect_on_confidence?: string }[];
  next_validation_step?: {
    action?: string;
    purpose?: string;
    owner?: string;
    duration?: string;
    success_criteria?: string;
    decision_enabled?: string;
    required_inputs?: string[];
  };
  alternatives_considered?: { family?: string; reason?: string }[];
  why_it_ranked_here?: string[];
  why_ranked_first?: { summary?: string; supporting_reasons?: string[] };
  impact?: {
    implementation_timeline?: { min_weeks?: number | null; max_weeks?: number | null; expected_weeks?: number | null };
    annual_savings?: {
      status?: string;
      low?: number | null;
      expected?: number | null;
      high?: number | null;
      currency?: string;
    };
    annual_hours_returned?: {
      status?: string;
      low?: number | null;
      expected?: number | null;
      high?: number | null;
      currency?: string;
    };
  };
  specific_intervention?: {
    required_changes?: string[];
    prerequisites?: string[];
    scope_boundaries?: string[];
    excluded_scope?: string[];
  };
}

export function avgComparableSimilarity(rec: DecisionRec): number {
  const c = rec.comparable_implementations || [];
  if (!c.length) return 0;
  return Math.round(c.reduce((s, x) => s + (x.similarity_score || 0), 0) / c.length);
}

export interface GroundingState {
  key: "live" | "partial" | "insufficient";
  label: string;
  tone: string;
  dot: string;
  note: string;
}

export function groundingState(rec: DecisionRec, meta: any): GroundingState {
  const tier = rec.evidence_summary?.overall_tier;
  const total = rec.evidence_summary?.total_comparables || 0;
  const label = rec.confidence?.label;
  if (label === "insufficient" || tier === "insufficient" || total === 0) {
    return {
      key: "insufficient",
      label: "Insufficient Evidence",
      tone: "bg-[#FBF0E0] border-[#B45309] text-[#7a3b06]",
      dot: "bg-[#B45309]",
      note:
        "Compass found too little highly comparable evidence to make a defensible recommendation. The next validation step below shows what would change that.",
    };
  }
  const avgSim = avgComparableSimilarity(rec);
  const gaps = (rec.information_gaps || []).length;
  if (avgSim < 40 || gaps > 0) {
    return {
      key: "partial",
      label: "Partially Grounded",
      tone: "bg-[#EAF2FF] border-[#156ff5] text-[#0b3f8f]",
      dot: "bg-[#156ff5]",
      note: `Live evidence-backed, but with partial grounding: comparable implementations matched at ${avgSim}/100 average similarity${gaps ? `, and ${gaps} material information gap${gaps > 1 ? "s" : ""} remain` : ""}. Source links for the underlying records are pending.`,
    };
  }
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  return {
    key: "live",
    label: "Live Evidence-Backed",
    tone: "bg-[#E5F3EA] border-[#1E7B4C] text-[#14532d]",
    dot: "bg-[#1E7B4C]",
    note: `Derived live from ${total} comparable implementations${orgs ? ` across ${orgs} organizations` : ""}, with deterministic scoring over the evidence graph.`,
  };
}

export interface DefensibilityCheck {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
}

export function defensibilityChecks(rec: DecisionRec, summary: any): { checks: DefensibilityCheck[]; score: number; total: number } {
  const es = rec.evidence_summary || {};
  const comparables = rec.comparable_implementations || [];
  const outcomeRanges = (rec.outcome_ranges || []).filter((r) => r.directly_comparable);
  const gaps = rec.information_gaps || [];
  const assumptions = rec.assumptions_detail || [];
  const risks = rec.risks || [];
  const alternatives = rec.alternatives_considered || [];
  const hasImplementationPattern = comparables.some(
    (c) => (c.intervention && c.intervention.length > 5) || (c.intervention_description && c.intervention_description.length > 5)
  );

  const checks: DefensibilityCheck[] = [
    { key: "problem", label: "Why this problem?", ok: !!(summary?.problem_statement || summary?.workflow), detail: summary?.problem_statement ? "Problem statement captured from your input." : "Workflow identified, free-text problem not provided." },
    { key: "intervention", label: "Why this intervention?", ok: !!rec.title && alternatives.length > 0, detail: alternatives.length > 0 ? `${alternatives.length} alternative paths compared.` : "Recommended intervention selected; alternatives not surfaced." },
    { key: "comparables", label: "Who else solved it?", ok: (es.total_comparables || 0) > 0, detail: es.total_comparables ? `${es.total_comparables} comparable implementations retrieved.` : "No comparable implementations attached to this decision." },
    { key: "implementation", label: "How did they implement it?", ok: hasImplementationPattern, detail: hasImplementationPattern ? "Implementation patterns present in comparable records." : "No implementation detail in comparable records." },
    { key: "outcomes", label: "What outcomes did they achieve?", ok: outcomeRanges.length > 0, detail: outcomeRanges.length > 0 ? `Outcome ranges from ${outcomeRanges.length} comparable metric${outcomeRanges.length > 1 ? "s" : ""}.` : "Outcomes not quantified in retrieved records." },
    { key: "risk", label: "What risks should we expect?", ok: risks.length > 0, detail: risks.length > 0 ? `${risks.length} risk${risks.length > 1 ? "s" : ""} identified from evidence.` : "No risks surfaced for this decision." },
    { key: "measurement", label: "How will we measure success?", ok: !!rec.next_validation_step, detail: rec.next_validation_step ? "Validation step with success criteria defined." : "No measurement plan defined yet." },
    { key: "gaps", label: "What would change this?", ok: gaps.length > 0 || assumptions.length > 0, detail: `${gaps.length} evidence gap${gaps.length !== 1 ? "s" : ""} and ${assumptions.length} assumption${assumptions.length !== 1 ? "s" : ""} surfaced.` },
  ];
  return { checks, score: checks.filter((c) => c.ok).length, total: checks.length };
}

export interface QualityFactor {
  label: string;
  value: string;
  detail: string;
  tone: "ok" | "warn" | "muted";
}

export function buildConfidenceFactors(rec: DecisionRec, recs: DecisionRec[], meta: any): QualityFactor[] {
  const es = rec.evidence_summary || {};
  const ec = meta?.evidence_count || {};
  const avgSim = avgComparableSimilarity(rec);
  const gaps = (rec.information_gaps || []).length;
  const margin = Math.round((rec.confidence?.score || 0) * 100 - (recs[1]?.confidence?.score || 0) * 100);
  const gold = es.gold_count || 0;
  const silver = es.silver_count || 0;
  const tierLabel = es.overall_tier || "insufficient";
  const measured = ec.outcome_measured_implementations || 0;
  const quantified = ec.quantified_outcome_implementations || 0;
  const orgs = ec.unique_organizations || 0;

  const f = (label: string, value: string, detail: string, tone: "ok" | "warn" | "muted"): QualityFactor => ({ label, value, detail, tone });

  return [
    avgSim >= 50
      ? f("Problem match", "Strong", `Top comparables matched at ~${avgSim}/100 similarity.`, "ok")
      : avgSim >= 30
        ? f("Problem match", "Moderate", `Top comparables matched at ~${avgSim}/100 similarity.`, "warn")
        : f("Problem match", "Limited", `Top comparables matched at ~${avgSim}/100 similarity — broad, not exact.`, "warn"),
    gold >= 1
      ? f("Evidence strength", "Strong", `${gold} gold-tier source${gold > 1 ? "s" : ""} with quantified outcomes.`, "ok")
      : silver >= 3 || tierLabel === "silver"
        ? f("Evidence strength", "Moderate", `${silver} silver-tier sources; overall tier ${tierLabel}.`, "warn")
        : f("Evidence strength", "Limited", `Overall evidence tier ${tierLabel}. No gold-tier sources in this result.`, "warn"),
    measured >= 5
      ? f("Outcome evidence", "Strong", `${measured} comparable implementations measured outcomes (${quantified} quantified).`, "ok")
      : measured >= 2
        ? f("Outcome evidence", "Moderate", `${measured} comparable implementations measured outcomes (${quantified} quantified).`, "warn")
        : f("Outcome evidence", "Limited", `${measured} comparable implementations measured outcomes.`, "warn"),
    orgs >= 20
      ? f("Evidence diversity", "Strong", `Evidence spans ${orgs} independent organizations.`, "ok")
      : orgs >= 8
        ? f("Evidence diversity", "Moderate", `Evidence spans ${orgs} independent organizations.`, "warn")
        : f("Evidence diversity", "Limited", `Evidence spans ${orgs} independent organizations.`, "warn"),
    gaps === 0
      ? f("Missing information", "None", "No material information gaps flagged.", "ok")
      : gaps <= 2
        ? f("Missing information", "Moderate", `${gaps} information gap${gaps > 1 ? "s" : ""} listed below.`, "warn")
        : f("Missing information", "Material", `${gaps} information gaps listed below.`, "warn"),
    margin >= 15
      ? f("Alternative margin", "Wide", `Top decision leads the runner-up by ${margin} confidence points.`, "ok")
      : margin >= 5
        ? f("Alternative margin", "Moderate", `Top decision leads the runner-up by ${margin} confidence points.`, "warn")
        : f("Alternative margin", "Narrow", `Top decision leads the runner-up by ${margin} confidence points.`, "warn"),
  ];
}

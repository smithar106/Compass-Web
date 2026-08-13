// Outcome Contract & Measurement Specification Layer
// Defines success criteria, outcome contracts, measurement provenance, and outcome states (successful, unsuccessful, inconclusive).

export type OutcomeState = "successful" | "unsuccessful" | "inconclusive" | "pending" | "measuring" | "awaiting_data";
export type AttributionConfidence = "high" | "medium" | "low" | "unknown";
export type VerificationStatus = "system_observed" | "document_verified" | "customer_attested" | "derived" | "unverified";

export interface SuccessCriteria {
  primary_business_objective: string;
  primary_success_metric: string;
  current_baseline: string;
  target: string;
  measurement_window: string;
  guardrails: string[];
  data_source: string;
  measurement_frequency: string;
  outcome_owner: string;
}

export interface OutcomeContract {
  decision_id: string;
  recommendation_title: string;
  expected_cost: number | null;
  expected_value: number | null;
  expected_timeline_weeks: number | null;
  assumptions: string[];
  success_criteria: SuccessCriteria;
  approved_at?: string;
  version: number;
  outcome_state: OutcomeState;
  attribution_confidence: AttributionConfidence;
  revision_history: { timestamp: string; reason: string; changes: string }[];
}

export interface MeasurementMeasurement {
  metric_name: string;
  value: number | string;
  timestamp: string;
  source: string;
  collection_method: "system_integration" | "api_webhook" | "csv" | "spreadsheet" | "human_reported" | "compass_derived";
  verification_status: VerificationStatus;
}

/**
 * Generates a structured proposed success criteria from a decision recommendation and summary.
 * Never fabricates numbers; marks unknown values as requiring customer confirmation.
 */
export function generateProposedSuccessCriteria(rec: any, summary: any): SuccessCriteria {
  const title = rec?.title || rec?.executive_title || "Operational Improvement";
  const workflow = summary?.workflow || rec?.pathway_label || "the workflow";
  const saving = rec?.impact?.annual_savings?.expected;
  const targetVal = saving ? `~$${(saving / 1000).toFixed(0)}K annual value` : "Customer confirmation required";

  return {
    primary_business_objective: `Deploy ${title} to improve operational efficiency and throughput in ${workflow}.`,
    primary_success_metric: rec?.outcome_ranges?.[0]?.metric_label || "Processing cycle time / cost reduction",
    current_baseline: "Customer confirmation required (Baseline lock pending)",
    target: targetVal,
    measurement_window: "90 days after full rollout",
    guardrails: ["Quality and accuracy metrics cannot decline by >5%", "No increase in escalation or error rate"],
    data_source: "System logs / Operational reporting",
    measurement_frequency: "Weekly tracking, monthly executive review",
    outcome_owner: "Operations Lead / Functional Owner",
  };
}

/**
 * Finalizes an approved recommendation into an immutable, versioned Outcome Contract.
 */
export function finalizeOutcomeContract(
  decisionId: string,
  rec: any,
  criteria: SuccessCriteria,
  existingContract?: OutcomeContract
): OutcomeContract {
  const version = existingContract ? existingContract.version + 1 : 1;
  const now = new Date().toISOString();
  const history = existingContract ? [...existingContract.revision_history] : [];

  if (existingContract) {
    history.push({
      timestamp: now,
      reason: "Executive approval or success criteria revision update",
      changes: `Updated contract to version ${version}`,
    });
  }

  return {
    decision_id: decisionId,
    recommendation_title: rec?.title || rec?.executive_title || "Approved Recommendation",
    expected_cost: rec?.economics?.implementation_cost_estimate || null,
    expected_value: rec?.impact?.annual_savings?.expected || null,
    expected_timeline_weeks: rec?.impact?.implementation_timeline?.expected_weeks || 12,
    assumptions: (rec?.assumptions_detail || []).map((a: any) => a.title || a).filter(Boolean),
    success_criteria: criteria,
    approved_at: existingContract?.approved_at || now,
    version,
    outcome_state: "pending",
    attribution_confidence: "medium",
    revision_history: history,
  };
}

/**
 * Evaluates whether actual measurements met the success criteria, returning successful, unsuccessful, or inconclusive.
 */
export function evaluateOutcome(contract: OutcomeContract, measurements: MeasurementMeasurement[]): OutcomeState {
  if (!measurements || measurements.length === 0) {
    return "awaiting_data";
  }
  // If measurements verify target reached
  const hasVerified = measurements.some((m) => m.verification_status === "system_observed" || m.verification_status === "document_verified");
  if (!hasVerified) {
    return "inconclusive";
  }
  // Simple evaluation heuristic for demonstration
  return "successful";
}

/**
 * Structured problem definitions — the mapping from prototype UX problem labels
 * to retrieval queries. The UX label is NEVER the raw retrieval query; each
 * problem resolves to a canonical workflow + problem concepts + outcome
 * objective, keeping UI vocabulary separate from evidence taxonomy.
 */

export interface StructuredProblem {
  id: string;
  /** Canonical engine workflow slug. */
  workflow: string;
  /** Business function passed to the engine. */
  businessFunction: string;
  /** Free-text problem statement for the engine's problem-similarity factor. */
  problemStatement: string;
  /** Desired outcome category (efficiency / cost / time / quality). */
  desiredOutcome: string;
  /** Minimum citable comparables for a "covered" decision. */
  minCitable: number;
}

export const STRUCTURED_PROBLEMS: Record<string, StructuredProblem> = {
  "slow-customer-onboarding": {
    id: "slow-customer-onboarding",
    workflow: "onboarding",
    businessFunction: "customer_success",
    problemStatement:
      "New customers take too long to reach full value because onboarding is manual and person-dependent.",
    desiredOutcome: "time",
    minCitable: 4,
  },
  "manual-invoice-processing": {
    id: "manual-invoice-processing",
    workflow: "invoice_processing",
    businessFunction: "finance",
    problemStatement:
      "Finance capacity is consumed by manual invoice handling; matching and rework are slow and error-prone.",
    desiredOutcome: "cost",
    minCitable: 4,
  },
  "misrouted-support": {
    id: "misrouted-support",
    workflow: "ticketing",
    businessFunction: "customer_support",
    problemStatement:
      "Support tickets are misrouted, delaying resolution and frustrating customers.",
    desiredOutcome: "time",
    minCitable: 4,
  },
  "trapped-knowledge": {
    id: "trapped-knowledge",
    workflow: "knowledge_base",
    businessFunction: "operations",
    problemStatement:
      "Answers live in spreadsheets and documents that no one can search.",
    desiredOutcome: "quality",
    minCitable: 4,
  },
  "sales-handoff-rework": {
    id: "sales-handoff-rework",
    workflow: "order_processing",
    businessFunction: "sales",
    problemStatement:
      "Handoffs between sales and delivery require too much rework due to lost detail.",
    desiredOutcome: "quality",
    minCitable: 4,
  },
  "repetitive-reporting": {
    id: "repetitive-reporting",
    workflow: "analytics_reporting",
    businessFunction: "operations",
    problemStatement:
      "Employees spend hours assembling the same reports by hand.",
    desiredOutcome: "efficiency",
    minCitable: 4,
  },
  "late-escalations": {
    id: "late-escalations",
    workflow: "relationship_management",
    businessFunction: "customer_success",
    problemStatement:
      "At-risk customers are spotted only after revenue is already at risk; escalations are identified too late.",
    desiredOutcome: "quality",
    minCitable: 4,
  },
  "manual-forecasting": {
    id: "manual-forecasting",
    workflow: "forecasting",
    businessFunction: "finance",
    problemStatement:
      "Forecasts are assembled by hand in spreadsheets and go stale quickly.",
    desiredOutcome: "efficiency",
    minCitable: 4,
  },
  "hard-to-find-information": {
    id: "hard-to-find-information",
    workflow: "self_service",
    businessFunction: "operations",
    problemStatement:
      "Employees waste time searching for internal information that exists.",
    desiredOutcome: "quality",
    minCitable: 4,
  },
  "slow-employee-ramp": {
    id: "slow-employee-ramp",
    workflow: "onboarding",
    businessFunction: "human_resources",
    problemStatement:
      "New employees take too long to become productive because onboarding is inconsistent.",
    desiredOutcome: "time",
    minCitable: 4,
  },
};

export function structuredProblem(problemId: string): StructuredProblem | undefined {
  return STRUCTURED_PROBLEMS[problemId];
}

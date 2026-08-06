/**
 * Maps assessment answers to the recommendation engine's profile payload.
 * Kept pure (no window/session access) so it can be unit-tested and reused
 * by the standalone assessment and any future intake surface.
 */

export interface AssessmentAnswerInput {
  questionId: string | number;
  value: string | number | boolean;
}

export interface AssessmentProfile {
  business_function: string;
  workflow: string;
  problem_statement: string;
  industry: string;
  company_size: string;
  workflow_frequency: string;
  people_involved: string;
  handoffs: string;
  current_tools: string[];
  exception_rate: string;
  budget_range: string;
  implementation_timeline: string;
  business_risk: string;
  process_stability: string;
  previous_attempts: string;
  desired_outcome: string;
}

const DEPARTMENT_WORKFLOWS: Record<string, string> = {
  Sales: "lead_qualification",
  Marketing: "marketing_automation",
  "Customer Success": "customer_health_scoring",
  Support: "ticketing",
  Finance: "invoice_processing",
  Product: "product_analytics",
  Engineering: "ci_cd",
  HR: "onboarding",
  IT: "it_automation",
  "Supply Chain": "supply_chain",
  Manufacturing: "manufacturing",
  Legal: "contract_review",
  Operations: "process_automation",
};

function toBusinessFunction(dept: string): string {
  if (dept === "Customer Success") return "customer_success";
  if (dept === "HR") return "human_resources";
  return dept.toLowerCase();
}

function toIndustry(businessFunction: string): string {
  if (businessFunction === "engineering" || businessFunction === "it" || businessFunction === "product") {
    return "technology";
  }
  if (businessFunction === "manufacturing") return "manufacturing";
  if (businessFunction === "supply_chain") return "logistics";
  if (businessFunction === "legal") return "legal";
  if (businessFunction === "finance") return "financial_services";
  if (businessFunction === "hr") return "human_resources";
  return "professional_services";
}

function toOutcomeKey(raw: unknown): string {
  if (typeof raw !== "string") return "efficiency";
  const text = raw.toLowerCase();
  if (text.includes("revenue")) return "revenue";
  if (text.includes("cost")) return "cost";
  if (text.includes("time")) return "time";
  if (text.includes("satisfaction")) return "satisfaction";
  if (text.includes("productivity")) return "productivity";
  if (text.includes("compliance")) return "compliance";
  if (text.includes("risk")) return "risk_reduction";
  if (text.includes("quality")) return "quality";
  if (text.includes("capacity") || text.includes("scale")) return "scale";
  if (text.includes("manual") || text.includes("automation")) return "automation";
  return "efficiency";
}

export function buildProfile(answers: AssessmentAnswerInput[]): AssessmentProfile {
  const m = new Map<string | number, string | number | boolean>();
  for (const a of answers || []) m.set(a.questionId, a.value);

  const dept = (m.get("dept") as string) || "Operations";
  const businessFunction = toBusinessFunction(dept);
  const problemStatement =
    (m.get("problem-description") as string) ||
    (m.get("situation") as string) ||
    `${dept} ops optimization`;

  return {
    business_function: businessFunction,
    workflow: DEPARTMENT_WORKFLOWS[dept] || "process_automation",
    problem_statement: problemStatement,
    industry: toIndustry(businessFunction),
    company_size: "",
    workflow_frequency: (m.get("frequency") as string) || "",
    people_involved: (m.get("people") as string) || "",
    handoffs: (m.get("handoffs") as string) || "",
    current_tools: [],
    exception_rate: (m.get("exceptions") as string) || "",
    budget_range: (m.get("budget") as string) || "",
    implementation_timeline: (m.get("timeline") as string) || "",
    business_risk: (m.get("risk") as string) || "",
    process_stability: (m.get("stability") as string) || "",
    previous_attempts: (m.get("prior-attempts") as string) || "",
    desired_outcome: toOutcomeKey(m.get("desired-outcome")),
  };
}

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
  constraint: string;
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
  /** Annualized workflow volume (items/year) — enables dollar impact estimates. */
  annual_workflow_volume: string;
  /** Average handling time per item (hours) — enables dollar impact estimates. */
  current_handling_time: string;
  /** Fully loaded cost of the team's time ($/hour) — enables dollar impact estimates. */
  loaded_labor_cost: string;
  /** What's preventing better performance (capacity, errors, speed, etc.) */
  standardization_level: string;
  /** Impact if the system gets it wrong */
  failure_impact: string;
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

/** Parse a range option label to its midpoint value (pure, unit-tested). */
function parseRangeMidpoint(
  label: unknown,
  lowerBound: (n: number) => number,
  upperBound: (n: number) => number
): string {
  const s = String(label ?? "").trim();
  if (!s) return "";
  const nums = s.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (s.startsWith("Under")) return String(lowerBound(nums[0] ?? 0));
  if (s.startsWith("Over")) return String(upperBound(nums[0] ?? 0));
  if (nums.length >= 2) return String((nums[0] + nums[1]) / 2);
  return "";
}

/** Monthly-volume option -> annualized items/year. */
export function annualVolumeFromLabel(label: unknown): string {
  const s = String(label ?? "").trim();
  if (!s) return "";
  const nums = s.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (s.startsWith("Under")) return String(Math.round((nums[0] ?? 1000) / 2) * 12);
  if (s.startsWith("Over")) return String(Math.round((nums[0] ?? 100000) * 1.5) * 12);
  if (nums.length >= 2) return String(Math.round((nums[0] + nums[1]) / 2) * 12);
  return "";
}

/** Handling-time option -> hours per item. */
export function handlingHoursFromLabel(label: unknown): string {
  const s = String(label ?? "").trim();
  const isHours = s.includes("hour");
  const nums = s.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const toHours = (n: number) => (isHours ? n : n / 60);
  if (s.startsWith("Under")) return String(toHours(nums[0] ?? (isHours ? 1 : 15)) / 2);
  if (s.startsWith("Over")) return String(toHours(nums[0] ?? (isHours ? 2 : 60)) * 1.5);
  if (nums.length >= 2) return String(toHours((nums[0] + nums[1]) / 2));
  return "";
}

/** Loaded-cost option -> $/hour midpoint. */
export function loadedCostFromLabel(label: unknown): string {
  return parseRangeMidpoint(
    label,
    (n) => n / 2, // Under $X -> X/2
    (n) => n * 1.25 // Over $X -> 1.25X
  );
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
    constraint: toConstraintKey(m.get("constraint")),
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
    annual_workflow_volume: annualVolumeFromLabel(m.get("volume")),
    current_handling_time: handlingHoursFromLabel(m.get("handling-time")),
    loaded_labor_cost: loadedCostFromLabel(m.get("loaded-cost")),
    standardization_level: toStandardizationKey(m.get("standardization")),
    failure_impact: toFailureImpactKey(m.get("failure-impact")),
  };
}

function toConstraintKey(raw: unknown): string {
  if (typeof raw !== "string") return "unknown";
  const t = raw.toLowerCase();
  if (t.includes("capacity")) return "capacity";
  if (t.includes("error")) return "errors";
  if (t.includes("slow") || t.includes("too long")) return "speed";
  if (t.includes("inconsistent") || t.includes("varies")) return "quality";
  if (t.includes("expensive") || t.includes("cost") || t.includes("unsustainable")) return "cost";
  if (t.includes("visibility") || t.includes("track") || t.includes("measure")) return "visibility";
  if (t.includes("compliance") || t.includes("regulatory")) return "compliance";
  if (t.includes("unknown") || t.includes("diagnose") || t.includes("root cause")) return "unknown";
  return "unknown";
}

function toStandardizationKey(raw: unknown): string {
  if (typeof raw !== "string") return "unknown";
  const t = raw.toLowerCase();
  if (t.includes("mostly repeatable")) return "repeatable";
  if (t.includes("repeatable with exceptions")) return "with_exceptions";
  if (t.includes("highly variable")) return "variable";
  if (t.includes("significant judgment")) return "heavy_judgment";
  return "unknown";
}

function toFailureImpactKey(raw: unknown): string {
  if (typeof raw !== "string") return "unknown";
  const t = raw.toLowerCase();
  if (t.includes("low impact") || t.includes("minor")) return "low";
  if (t.includes("moderate")) return "moderate";
  if (t.includes("material") || t.includes("financial") || t.includes("customer")) return "material";
  if (t.includes("regulatory") || t.includes("safety") || t.includes("legal")) return "regulatory";
  return "unknown";
}

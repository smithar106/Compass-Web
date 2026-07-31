// Deterministic normalization and adaptive follow-up selection for the
// Analyze an Operational Problem pathway. Pure functions, no network.

export interface NormalizedProblem {
  workflow: string;
  businessFunction: string;
  problemStatement: string;
  rootCauseHypothesis: string;
  desiredOutcome: string;
  decision: string;
}

const WORKFLOW_MAP: { match: RegExp; workflow: string; businessFunction: string }[] = [
  { match: /invoice|payable|payments|billing|reconciliation|procurement|ap\b/i, workflow: "invoice_processing", businessFunction: "finance" },
  { match: /onboard|customer setup|welcome|kickoff|implementation.*customer/i, workflow: "onboarding", businessFunction: "customer_success" },
  { match: /support|ticket|escalat|complaint|help ?desk|service ?desk/i, workflow: "ticketing", businessFunction: "support" },
  { match: /contract|legal|clause|agreement|mnda/i, workflow: "contract_review", businessFunction: "legal" },
  { match: /lead|sales|qualif|prospecting|pipeline/i, workflow: "lead_qualification", businessFunction: "sales" },
  { match: /marketing|campaign|lead nurturing|email.*campaign/i, workflow: "marketing_automation", businessFunction: "marketing" },
  { match: /ci ?cd|deploy|release|build.*test/i, workflow: "ci_cd", businessFunction: "engineering" },
  { match: /knowledge|spreadsheet|tribal|documentation|information|search/i, workflow: "process_automation", businessFunction: "operations" },
  { match: /report|reporting|dashboard|kpi|metric|monthly close|reconcil/i, workflow: "process_automation", businessFunction: "finance" },
  { match: /manufactur|production|assembly|warehouse|quality.*line/i, workflow: "manufacturing", businessFunction: "operations" },
  { match: /supply|inventory|logistics|fulfil/i, workflow: "supply_chain", businessFunction: "operations" },
];

const DEFAULT = { workflow: "process_automation", businessFunction: "operations" };

export function inferDesiredOutcome(text: string): string {
  const t = text.toLowerCase();
  if (/(cost|expensive|spend|budget|overhead|saving|save money)/.test(t)) return "cost";
  if (/(time|slow|delay|cycle|long|wait|faster|days)/.test(t)) return "time";
  if (/(error|mistake|quality|rework|defect|accuracy|incorrect)/.test(t)) return "quality";
  if (/(revenue|sell|convert|grow|acquisition|churn)/.test(t)) return "revenue";
  if (/(compliance|regulat|audit)/.test(t)) return "compliance";
  if (/(capacity|scale|volume|throughput|productivity|manual work)/.test(t)) return "efficiency";
  return "efficiency";
}

export function rootCauseFor(workflow: string): string {
  const templates: Record<string, string> = {
    invoice_processing:
      "Manual receipt, validation, and matching steps with no structured routing; exceptions are handled individually, so cost and error rate scale with volume.",
    onboarding:
      "Manual intake and handoffs across approvals and system setup; no standardized sequence, so cycle time depends on whoever happens to be available.",
    ticketing:
      "Escalation triage is manual and unstandardized; routing depends on experience, so high-priority items wait and resolution time is inconsistent.",
    contract_review:
      "Contract review is serial and human-only; clauses are checked one document at a time with no extraction or queueing, so backlog compounds.",
    lead_qualification:
      "Leads arrive through multiple channels and are qualified by hand with no scoring criteria, so response time and follow-up consistency suffer.",
    marketing_automation:
      "Campaigns are assembled and sent as single broadcasts; no segmentation or triggers, so engagement and conversion stay below what the channel supports.",
    ci_cd:
      "Build, test, and deploy steps are manual and unautomated, so releases are slow, risky, and dependent on specific individuals.",
    process_automation:
      "Work relies on manual steps and tribal knowledge with no single source of truth, so effort repeats and answers vary by person.",
    manufacturing:
      "Line and quality processes have manual checkpoints with limited instrumentation, so defects surface late and throughput is inconsistent.",
    supply_chain:
      "Inventory and logistics coordination is manual across systems, so stockouts and delays follow from slow, error-prone handoffs.",
  };
  return templates[workflow] || "A manual, unstandardized workflow with no automation; effort and errors scale with volume.";
}

export function normalizeProblem(text: string): NormalizedProblem {
  const clean = text.trim();
  const lower = clean.toLowerCase();
  let match = DEFAULT;
  for (const m of WORKFLOW_MAP) {
    if (m.match.test(lower)) {
      match = { workflow: m.workflow, businessFunction: m.businessFunction };
      break;
    }
  }
  const desiredOutcome = inferDesiredOutcome(clean);
  return {
    workflow: match.workflow,
    businessFunction: match.businessFunction,
    problemStatement: clean.slice(0, 400),
    rootCauseHypothesis: rootCauseFor(match.workflow),
    desiredOutcome,
    decision: `Which intervention best improves ${desiredOutcome} for ${match.workflow.replace(/_/g, " ")}?`,
  };
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  why: string;
  factor: string;
  type: "choice" | "text";
  options?: string[];
  required: boolean;
}

const QUESTION_BANK: FollowUpQuestion[] = [
  { id: "cycle_time", question: "What is the current cycle time per item?", why: "Baseline cycle time is required to quantify the impact of an intervention.", factor: "Outcome evidence", type: "choice", options: ["Minutes", "Hours", "1–2 days", "3–5 days", "Weeks", "Not measured"], required: true },
  { id: "workflow_frequency", question: "How often does this workflow run?", why: "Frequency determines whether automation or redesign pays for itself.", factor: "Outcome evidence", type: "choice", options: ["Daily", "Weekly", "Monthly", "Quarterly", "Continuously"], required: true },
  { id: "labor_cost", question: "What is the loaded hourly cost of the people involved?", why: "Without a labor cost, Compass cannot estimate dollar-denominated savings.", factor: "Outcome evidence", type: "choice", options: ["<$20/hr", "$20–$40/hr", "$40–$60/hr", "$60–$100/hr", "$100+/hr"], required: false },
  { id: "people_involved", question: "How many people are involved today?", why: "Team size scales the time an intervention can return.", factor: "Problem fit", type: "choice", options: ["1 person", "2–3 people", "4–10 people", "11–50 people", "50+ people"], required: false },
  { id: "exception_rate", question: "How many exceptions or edge cases arise?", why: "Exception rate decides how much of the workflow can be automated or standardized.", factor: "Intervention suitability", type: "choice", options: ["Few (<5%)", "Some (5–10%)", "Many (10–30%)", "Highly variable (30%+)"], required: false },
  { id: "judgment_requirement", question: "Does the work require judgment, or is it rule-based?", why: "Rule-based work can be automated; judgment-heavy work needs human review.", factor: "Intervention suitability", type: "choice", options: ["Fully rule-based", "Mostly rule-based", "Mixed", "Mostly judgment"], required: false },
  { id: "budget_range", question: "What implementation budget is available?", why: "Budget constrains which intervention families are feasible.", factor: "Implementation evidence", type: "choice", options: ["Under $10K", "$10K–$50K", "$50K–$100K", "$100K–$250K", "$250K+"], required: false },
  { id: "implementation_timeline", question: "What is your expected timeline?", why: "Timeline filters out interventions that cannot deliver in time.", factor: "Implementation evidence", type: "choice", options: ["1–2 months", "3–4 months", "5–6 months", "6–12 months", "Flexible"], required: false },
  { id: "business_risk", question: "What is the risk of getting this wrong?", why: "Risk shapes how much validation an intervention needs before commitment.", factor: "Risk coverage", type: "choice", options: ["Low", "Medium", "High", "Critical"], required: false },
  { id: "process_stability", question: "How stable is this process?", why: "Unstable processes need redesign before automation.", factor: "Risk coverage", type: "choice", options: ["Very stable", "Mostly stable", "Somewhat variable", "Highly variable"], required: false },
];

const INFERRED_PATTERNS: { id: string; match: RegExp }[] = [
  { id: "cycle_time", match: /\d+\s*(minutes|hours|days|weeks)/i },
  { id: "workflow_frequency", match: /daily|weekly|monthly|quarterly|per day|per week|per month/i },
  { id: "people_involved", match: /\d+\s*(people|fte|staff|employees|agents|analysts|reps)/i },
  { id: "exception_rate", match: /exception|edge case|error rate|error-prone|variable/i },
  { id: "budget_range", match: /budget|funding|\$\d|\b\d{2,4}k\b|capital/i },
  { id: "desired_outcome", match: /.*/ },
];

export function inferAnswersFromText(text: string): Set<string> {
  const set = new Set<string>();
  for (const p of INFERRED_PATTERNS) {
    if (p.match.test(text)) set.add(p.id);
  }
  return set;
}

export function selectFollowUps(params: {
  text: string;
  answers: Record<string, string>;
  engineGaps: { title: string }[];
  max?: number;
}): FollowUpQuestion[] {
  const max = params.max ?? 5;
  const inferred = inferAnswersFromText(params.text);
  const answered = params.answers;
  const gapTitles = params.engineGaps.map((g) => g.title.toLowerCase());

  // Promote questions that the engine flagged as material gaps.
  const hasVolumeGap = gapTitles.some((t) => t.includes("volume") || t.includes("handling time"));
  const hasLaborGap = gapTitles.some((t) => t.includes("labor cost") || t.includes("loaded"));

  const priority: string[] = [];
  if (hasVolumeGap) priority.push("cycle_time", "workflow_frequency");
  if (hasLaborGap) priority.push("labor_cost");
  priority.push(
    "cycle_time",
    "workflow_frequency",
    "people_involved",
    "exception_rate",
    "judgment_requirement",
    "budget_range",
    "implementation_timeline",
    "business_risk",
    "process_stability"
  );

  // Desired outcome is only asked if it could not be inferred from the text.
  const outcomeInferred = inferDesiredOutcome(params.text) !== "efficiency" || /outcome|result|goal/.test(params.text.toLowerCase());

  const result: FollowUpQuestion[] = [];
  if (!outcomeInferred) {
    result.push({
      id: "desired_outcome",
      question: "What outcome matters most?",
      why: "The decision is ranked around the outcome you are trying to improve.",
      factor: "Goal alignment",
      type: "choice",
      options: ["Reduce cost", "Save time", "Improve quality", "Increase revenue", "Compliance", "Scale capacity"],
      required: true,
    });
  }

  for (const id of priority) {
    if (result.length >= max) break;
    if (inferred.has(id) || answered[id]) continue;
    const q = QUESTION_BANK.find((x) => x.id === id);
    if (q) result.push(q);
  }
  return result.slice(0, max);
}

export function buildProfileFromAnalyze(
  norm: NormalizedProblem,
  answers: Record<string, string>
): Record<string, unknown> {
  const currentTools = answers.current_tools && answers.current_tools.trim() ? [answers.current_tools.trim()] : [];
  return {
    business_function: answers.business_function || norm.businessFunction,
    workflow: answers.workflow || norm.workflow,
    problem_statement: answers.problem_statement || norm.problemStatement,
    industry: answers.industry || "",
    company_size: answers.company_size || "",
    workflow_frequency: answers.workflow_frequency || "",
    people_involved: answers.people_involved || "",
    handoffs: answers.handoffs || "",
    current_tools: currentTools,
    exception_rate: answers.exception_rate || "",
    budget_range: answers.budget_range || "",
    implementation_timeline: answers.implementation_timeline || "",
    business_risk: answers.business_risk || "",
    process_stability: answers.process_stability || "",
    previous_attempts: answers.previous_attempts || "",
    desired_outcome: answers.desired_outcome || norm.desiredOutcome,
  };
}

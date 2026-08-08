/**
 * Deterministic demo fixtures for the COO demo portal (/demo).
 *
 * These values are seeded, stable, and used only for demonstration. Nothing in
 * this module reads from or writes to production data, databases, or engines.
 */

export type DecisionStatus =
  | "under_review"
  | "pilot_approved"
  | "active"
  | "completed";

export type EvidenceStrength = "strong" | "moderate" | "thin" | "insufficient";

export interface MeasuredMetric {
  metric: string;
  expected: string;
  actual: string;
  unit: string;
}

export interface DemoDecision {
  id: string;
  title: string;
  recommendation: string;
  businessFunction: string;
  status: DecisionStatus;
  expectedImpact: string;
  owner: string;
  nextAction: string;
  evidence: EvidenceStrength;
  confidence: string;
  roi: string;
  timeline: string;
  summary: string;
  phases: string[];
  outcome?: MeasuredMetric[];
}

export const DEMO_ORG = {
  name: "Northwind Manufacturing",
  period: "Q2 2026",
};

export const DEMO_EVIDENCE_LABELS: Record<EvidenceStrength, string> = {
  strong: "Strong evidence",
  moderate: "Moderate evidence",
  thin: "Thin evidence",
  insufficient: "Insufficient evidence",
};

export const DEMO_STATUS_LABELS: Record<DecisionStatus, string> = {
  under_review: "Under review",
  pilot_approved: "Pilot approved",
  active: "Active implementation",
  completed: "Completed · measured",
};

export const demoDecisions: DemoDecision[] = [
  {
    id: "invoice-ai",
    title: "AI-powered invoice processing",
    recommendation: "Automated invoice matching with exception-based review",
    businessFunction: "Finance",
    status: "pilot_approved",
    expectedImpact: "40–60% lower processing cost",
    owner: "VP, Finance Operations",
    nextAction: "Review pilot results; decide scale-up",
    evidence: "strong",
    confidence: "High",
    roi: "$310K/yr · 7-month payback",
    timeline: "Weeks 1–16",
    summary:
      "Manual invoice processing consumes significant finance capacity and drives avoidable cost. Compass recommends automated invoice matching with human review on exceptions only, delivered through a controlled pilot before scale.",
    phases: [
      "Establish the baseline (volume, cost, error rate)",
      "Configure matching rules and exception paths",
      "Run the pilot on highest-volume vendors",
      "Scale with agreed success criteria",
    ],
  },
  {
    id: "support-automation",
    title: "Customer support automation",
    recommendation: "Hybrid triage with deterministic routing",
    businessFunction: "Support",
    status: "active",
    expectedImpact: "25–40% faster resolution",
    owner: "Head of Support Operations",
    nextAction: "Complete baseline review",
    evidence: "strong",
    confidence: "High",
    roi: "$480K/yr · 5-month payback",
    timeline: "Weeks 1–14",
    summary:
      "Support agents repeat the same triage work daily. Compass recommends deterministic routing with AI-assisted drafting, keeping humans in the loop for complex cases.",
    phases: [
      "Map ticket types and resolution paths",
      "Deploy routing rules and triage queues",
      "Pilot on two product lines",
      "Expand with measured resolution targets",
    ],
  },
  {
    id: "procurement-redesign",
    title: "Procurement workflow redesign",
    recommendation: "Process redesign with guided buying",
    businessFunction: "Supply Chain",
    status: "under_review",
    expectedImpact: "30% shorter cycle time",
    owner: "Chief Procurement Officer",
    nextAction: "Submit for executive review",
    evidence: "moderate",
    confidence: "Medium",
    roi: "$220K/yr · 6-month payback",
    timeline: "Weeks 1–12",
    summary:
      "Procurement requests stall across handoffs and approvals. Compass recommends redesigning the intake and approval workflow before adding new software.",
    phases: [
      "Document the current intake and approval path",
      "Standardize request forms and routing",
      "Introduce guided buying for common categories",
      "Measure cycle time against baseline",
    ],
  },
  {
    id: "fleet-optimization",
    title: "Fleet operations optimization",
    recommendation: "Telematics-based routing optimization",
    businessFunction: "Operations",
    status: "active",
    expectedImpact: "15–20% lower fuel cost",
    owner: "VP, Operations",
    nextAction: "Assess pilot results",
    evidence: "moderate",
    confidence: "Medium",
    roi: "$410K/yr · 9-month payback",
    timeline: "Weeks 1–20",
    summary:
      "Routing is done manually and fuel spend is rising. Compass recommends telematics-based route optimization with driver feedback loops.",
    phases: [
      "Instrument routes and capture baseline mileage",
      "Deploy optimized routing model",
      "Run a two-region pilot",
      "Roll out with fuel-efficiency targets",
    ],
  },
  {
    id: "contract-review",
    title: "Contract review",
    recommendation: "AI-assisted clause extraction with review queues",
    businessFunction: "Legal",
    status: "completed",
    expectedImpact: "40% faster review at same quality",
    owner: "General Counsel",
    nextAction: "Review Q2 measured outcomes",
    evidence: "thin",
    confidence: "Moderate",
    roi: "$410K/yr · 9-month payback",
    timeline: "Weeks 1–18",
    summary:
      "The contract review backlog was cleared faster with AI-assisted clause extraction while keeping legal review on high-risk terms.",
    phases: [
      "Index the contract repository",
      "Deploy clause extraction with review queues",
      "Pilot on nondisclosure agreements",
      "Expand to customer and vendor contracts",
    ],
    outcome: [
      { metric: "Contract review cycle time", expected: "40% faster", actual: "44% faster", unit: "cycle time" },
      { metric: "Backlog cleared", expected: "By week 12", actual: "By week 9", unit: "backlog" },
    ],
  },
  {
    id: "onboarding-automation",
    title: "Customer onboarding automation",
    recommendation: "Process redesign + template automation",
    businessFunction: "Customer Success",
    status: "under_review",
    expectedImpact: "30% shorter onboarding",
    owner: "VP, Customer Experience",
    nextAction: "Prioritize against active portfolio",
    evidence: "moderate",
    confidence: "Medium",
    roi: "$120K/yr · 3-month payback",
    timeline: "Weeks 1–10",
    summary:
      "Onboarding takes 45 days because approvals and setup are manual. Compass recommends redesigning the process before layering on new software.",
    phases: [
      "Map onboarding handoffs and delays",
      "Standardize setup tasks and templates",
      "Automate repeatable data entry",
      "Measure time-to-value against baseline",
    ],
  },
  {
    id: "returns-processing",
    title: "Returns and exceptions processing",
    recommendation: "Deterministic rules with human review",
    businessFunction: "Operations",
    status: "active",
    expectedImpact: "35% faster exception handling",
    owner: "Operations Manager",
    nextAction: "Complete baseline review",
    evidence: "moderate",
    confidence: "Medium",
    roi: "$95K/yr · 4-month payback",
    timeline: "Weeks 1–10",
    summary:
      "Returns and exceptions are handled ad hoc. Compass recommends deterministic rules for common cases with human review for the remainder.",
    phases: [
      "Classify exception types and frequencies",
      "Build decision rules for common cases",
      "Pilot with the returns team",
      "Expand and track handling time",
    ],
  },
  {
    id: "quote-to-order",
    title: "Quote-to-order handoffs",
    recommendation: "Handoff standardization + CRM workflow",
    businessFunction: "Sales",
    status: "pilot_approved",
    expectedImpact: "2× faster quoting",
    owner: "VP, Sales Operations",
    nextAction: "Decide pilot scale-up",
    evidence: "thin",
    confidence: "Moderate",
    roi: "$150K/yr · 3-month payback",
    timeline: "Weeks 1–8",
    summary:
      "Quotes stall between sales and order management. Compass recommends standardizing handoffs before considering a CRM replacement.",
    phases: [
      "Document the quote handoff",
      "Standardize fields and owners",
      "Add guided workflow in the CRM",
      "Measure quote cycle time",
    ],
  },
  {
    id: "knowledge-base",
    title: "Knowledge management platform",
    recommendation: "Structured knowledge base + governed search",
    businessFunction: "IT",
    status: "under_review",
    expectedImpact: "20–30% fewer repeat questions",
    owner: "Head of Business Operations",
    nextAction: "Scope data sources",
    evidence: "strong",
    confidence: "High",
    roi: "$260K/yr · 6-month payback",
    timeline: "Weeks 1–16",
    summary:
      "Tribal knowledge is trapped in spreadsheets and email. Compass recommends a governed knowledge base before any AI assistant is layered on.",
    phases: [
      "Inventory knowledge sources",
      "Stand up structured knowledge base",
      "Deploy governed search",
      "Track repeat-question rate",
    ],
  },
  {
    id: "escalation-triage",
    title: "Escalation triage redesign",
    recommendation: "Hybrid workflow redesign + deterministic routing",
    businessFunction: "Operations",
    status: "completed",
    expectedImpact: "25–40% faster resolution",
    owner: "COO",
    nextAction: "Review measured outcomes",
    evidence: "strong",
    confidence: "High",
    roi: "$230K/yr · 6-month payback",
    timeline: "Weeks 1–14",
    summary:
      "Escalation triage was reworked with deterministic routing, cutting resolution time and freeing senior staff for complex cases.",
    phases: [
      "Measure baseline escalation volume",
      "Design routing rules",
      "Pilot with the escalation desk",
      "Scale across regions",
    ],
    outcome: [
      { metric: "First-response time", expected: "30% faster", actual: "27% faster", unit: "time" },
      { metric: "Senior staff load", expected: "25% lower", actual: "31% lower", unit: "load" },
    ],
  },
  {
    id: "expense-automation",
    title: "Expense reporting automation",
    recommendation: "Automated expense capture with policy checks",
    businessFunction: "Finance",
    status: "active",
    expectedImpact: "50% less time on expense reports",
    owner: "Controller",
    nextAction: "Monitor adoption",
    evidence: "moderate",
    confidence: "Medium",
    roi: "$80K/yr · 3-month payback",
    timeline: "Weeks 1–8",
    summary:
      "Expense reporting is manual and policy violations slip through. Compass recommends automated capture with real-time policy checks.",
    phases: [
      "Define policy rules and categories",
      "Connect card feeds and receipts",
      "Roll out to two departments",
      "Monitor adoption and error rate",
    ],
  },
  {
    id: "vendor-onboarding",
    title: "Vendor onboarding automation",
    recommendation: "Digital vendor intake + document verification",
    businessFunction: "Supply Chain",
    status: "completed",
    expectedImpact: "35% faster onboarding",
    owner: "Director, Procurement",
    nextAction: "Review measured outcomes",
    evidence: "moderate",
    confidence: "Medium",
    roi: "$140K/yr · 5-month payback",
    timeline: "Weeks 1–12",
    summary:
      "Vendor onboarding moved to a digital intake with automated document verification, cutting cycle time and follow-up emails.",
    phases: [
      "Build digital intake form",
      "Automate document checks",
      "Pilot with top 20 vendors",
      "Expand to all new vendors",
    ],
    outcome: [
      { metric: "Vendor onboarding cycle", expected: "35% faster", actual: "38% faster", unit: "cycle time" },
    ],
  },
  {
    id: "shift-scheduling",
    title: "Shift scheduling optimization",
    recommendation: "Constraint-based scheduling software",
    businessFunction: "HR",
    status: "completed",
    expectedImpact: "50% less scheduling time",
    owner: "HR Director",
    nextAction: "Review measured outcomes",
    evidence: "thin",
    confidence: "Moderate",
    roi: "$60K/yr · 4-month payback",
    timeline: "Weeks 1–10",
    summary:
      "Managers built shift schedules by hand. Constraint-based scheduling cut the time to publish a schedule and reduced conflicts.",
    phases: [
      "Codify shift and coverage rules",
      "Configure scheduling tool",
      "Pilot in two departments",
      "Roll out with manager training",
    ],
    outcome: [
      { metric: "Scheduling time per week", expected: "50% lower", actual: "46% lower", unit: "time" },
    ],
  },
  {
    id: "inventory-reconciliation",
    title: "Inventory reconciliation automation",
    recommendation: "Automated matching with exception queues",
    businessFunction: "Operations",
    status: "completed",
    expectedImpact: "60% less reconciliation time",
    owner: "VP, Supply Chain",
    nextAction: "Review measured outcomes",
    evidence: "strong",
    confidence: "High",
    roi: "$190K/yr · 6-month payback",
    timeline: "Weeks 1–14",
    summary:
      "Nightly inventory reconciliation was automated with exception queues, letting the team focus on discrepancies that matter.",
    phases: [
      "Connect inventory sources",
      "Build matching and exception rules",
      "Run parallel with manual process",
      "Cut over and measure time saved",
    ],
    outcome: [
      { metric: "Reconciliation time", expected: "60% lower", actual: "57% lower", unit: "time" },
    ],
  },
  {
    id: "document-processing",
    title: "Document processing automation",
    recommendation: "Intelligent document processing",
    businessFunction: "IT",
    status: "completed",
    expectedImpact: "40% lower processing cost",
    owner: "CIO",
    nextAction: "Review measured outcomes",
    evidence: "strong",
    confidence: "High",
    roi: "$310K/yr · 8-month payback",
    timeline: "Weeks 1–16",
    summary:
      "Intelligent document processing automated extraction across finance documents, delivering a larger cost reduction than projected.",
    phases: [
      "Identify high-volume document types",
      "Train extraction with human review",
      "Pilot on one business unit",
      "Expand with quality gates",
    ],
    outcome: [
      { metric: "Document processing cost", expected: "40% lower", actual: "52% lower", unit: "cost" },
    ],
  },
];

export const PRIORITY_DECISION_IDS = [
  "invoice-ai",
  "support-automation",
  "procurement-redesign",
  "fleet-optimization",
  "contract-review",
];

export const priorityDecisions: DemoDecision[] = PRIORITY_DECISION_IDS.map((id) => {
  const d = demoDecisions.find((x) => x.id === id);
  if (!d) throw new Error(`Demo priority decision not found: ${id}`);
  return d;
});

export const decisionById = (id: string): DemoDecision | undefined =>
  demoDecisions.find((d) => d.id === id);

export const demoSummary = {
  underReview: demoDecisions.filter((d) => d.status === "under_review").length,
  approvedPilots: demoDecisions.filter((d) => d.status === "pilot_approved").length,
  activeImplementations: demoDecisions.filter((d) => d.status === "active").length,
  completedMeasured: demoDecisions.filter((d) => d.status === "completed").length,
};

export interface CoverageRow {
  businessFunction: string;
  strength: EvidenceStrength;
}

export const coverageByFunction: CoverageRow[] = [
  { businessFunction: "Finance", strength: "strong" },
  { businessFunction: "Support", strength: "strong" },
  { businessFunction: "Operations", strength: "moderate" },
  { businessFunction: "Supply Chain", strength: "moderate" },
  { businessFunction: "Customer Success", strength: "moderate" },
  { businessFunction: "IT", strength: "thin" },
  { businessFunction: "Legal", strength: "thin" },
  { businessFunction: "Sales", strength: "thin" },
  { businessFunction: "HR", strength: "insufficient" },
  { businessFunction: "Manufacturing", strength: "insufficient" },
];

export const coverageSummary = {
  strong: coverageByFunction.filter((c) => c.strength === "strong").length,
  moderate: coverageByFunction.filter((c) => c.strength === "moderate").length,
  thin: coverageByFunction.filter((c) => c.strength === "thin").length,
  insufficient: coverageByFunction.filter((c) => c.strength === "insufficient").length,
};

export interface ActivityItem {
  id: string;
  type:
    | "recommendation_submitted"
    | "pilot_approved"
    | "baseline_completed"
    | "measured_outcome"
    | "partner_assigned";
  text: string;
  time: string;
  actor: string;
}

export const demoActivity: ActivityItem[] = [
  {
    id: "act-1",
    type: "recommendation_submitted",
    text: "Recommendation submitted for review — Procurement workflow redesign",
    time: "2h ago",
    actor: "Compass",
  },
  {
    id: "act-2",
    type: "pilot_approved",
    text: "Pilot approved — AI-powered invoice processing",
    time: "1d ago",
    actor: "VP, Finance Operations",
  },
  {
    id: "act-3",
    type: "baseline_completed",
    text: "Baseline completed — Customer support automation",
    time: "2d ago",
    actor: "Head of Support Operations",
  },
  {
    id: "act-4",
    type: "measured_outcome",
    text: "Measured outcome added — Contract review",
    time: "3d ago",
    actor: "General Counsel",
  },
  {
    id: "act-5",
    type: "partner_assigned",
    text: "Implementation partner assigned — Fleet operations optimization",
    time: "5d ago",
    actor: "COO",
  },
  {
    id: "act-6",
    type: "recommendation_submitted",
    text: "Recommendation submitted for review — Knowledge management platform",
    time: "1w ago",
    actor: "Head of Business Operations",
  },
];

export const measuredOutcomes = demoDecisions
  .filter((d) => d.status === "completed" && d.outcome)
  .flatMap((d) =>
    (d.outcome ?? []).map((m) => ({
      decisionId: d.id,
      decision: d.title,
      businessFunction: d.businessFunction,
      ...m,
    }))
  );

export const outcomesSummary = {
  completedDecisions: demoDecisions.filter((d) => d.status === "completed").length,
  metOrExceeded: measuredOutcomes.filter((o) => {
    const actual = parseFloat(String(o.actual).replace(/[^0-9.]/g, ""));
    const expected = parseFloat(String(o.expected).replace(/[^0-9.]/g, ""));
    return !isNaN(actual) && !isNaN(expected) && actual >= expected;
  }).length,
  totalMetrics: measuredOutcomes.length,
};

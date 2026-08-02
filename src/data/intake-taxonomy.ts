// Fast-intake taxonomy for the executive Analyze flow.
//
// Q1 (department) and Q2 (problem) are the moat: every department gets its
// own curated top-10 operational problems, and each problem maps to a known
// workflow so the engine can normalize it without free text.

export interface IntakeProblem {
  label: string;
  workflow: string;
  businessFunction: string;
}

export interface IntakeDepartment {
  label: string;
  problems: IntakeProblem[];
}

export const DEPARTMENTS: IntakeDepartment[] = [
  {
    label: "Finance",
    problems: [
      { label: "Manual invoice processing", workflow: "invoice_processing", businessFunction: "finance" },
      { label: "Accounts payable and payments", workflow: "invoice_processing", businessFunction: "finance" },
      { label: "Expense approvals", workflow: "process_automation", businessFunction: "finance" },
      { label: "Financial close and reconciliation", workflow: "process_automation", businessFunction: "finance" },
      { label: "Audit preparation and compliance", workflow: "process_automation", businessFunction: "finance" },
      { label: "Billing and collections", workflow: "invoice_processing", businessFunction: "finance" },
      { label: "Procurement and purchase orders", workflow: "supply_chain", businessFunction: "finance" },
      { label: "Budgeting and forecasting", workflow: "process_automation", businessFunction: "finance" },
      { label: "Vendor management", workflow: "supply_chain", businessFunction: "finance" },
      { label: "Tax and regulatory reporting", workflow: "process_automation", businessFunction: "finance" },
    ],
  },
  {
    label: "Operations",
    problems: [
      { label: "Manual reporting", workflow: "process_automation", businessFunction: "operations" },
      { label: "Spreadsheet-based processes", workflow: "process_automation", businessFunction: "operations" },
      { label: "Order fulfillment", workflow: "supply_chain", businessFunction: "operations" },
      { label: "Inventory management", workflow: "supply_chain", businessFunction: "operations" },
      { label: "Handoff coordination between teams", workflow: "process_automation", businessFunction: "operations" },
      { label: "Duplicate data entry", workflow: "process_automation", businessFunction: "operations" },
      { label: "Process documentation", workflow: "process_automation", businessFunction: "operations" },
      { label: "Quality checks and control", workflow: "manufacturing", businessFunction: "operations" },
      { label: "Capacity and resource planning", workflow: "process_automation", businessFunction: "operations" },
      { label: "Vendor and supplier coordination", workflow: "supply_chain", businessFunction: "operations" },
    ],
  },
  {
    label: "Customer Support",
    problems: [
      { label: "Manual ticket triage", workflow: "ticketing", businessFunction: "support" },
      { label: "Escalation routing", workflow: "ticketing", businessFunction: "support" },
      { label: "Slow resolution times", workflow: "ticketing", businessFunction: "support" },
      { label: "Repetitive agent responses", workflow: "ticketing", businessFunction: "support" },
      { label: "Knowledge trapped in documents", workflow: "process_automation", businessFunction: "support" },
      { label: "Customer onboarding", workflow: "onboarding", businessFunction: "support" },
      { label: "Quality assurance of responses", workflow: "ticketing", businessFunction: "support" },
      { label: "Support performance reporting", workflow: "process_automation", businessFunction: "support" },
      { label: "Self-service gaps", workflow: "ticketing", businessFunction: "support" },
      { label: "Complaint handling", workflow: "ticketing", businessFunction: "support" },
    ],
  },
  {
    label: "Sales",
    problems: [
      { label: "Lead qualification", workflow: "lead_qualification", businessFunction: "sales" },
      { label: "Slow lead response time", workflow: "lead_qualification", businessFunction: "sales" },
      { label: "CRM data entry", workflow: "process_automation", businessFunction: "sales" },
      { label: "Quote-to-order handoffs", workflow: "process_automation", businessFunction: "sales" },
      { label: "Pipeline reporting", workflow: "process_automation", businessFunction: "sales" },
      { label: "Contract approval delays", workflow: "contract_review", businessFunction: "sales" },
      { label: "Renewal tracking", workflow: "process_automation", businessFunction: "sales" },
      { label: "Territory and account allocation", workflow: "process_automation", businessFunction: "sales" },
      { label: "New rep onboarding", workflow: "onboarding", businessFunction: "sales" },
      { label: "Forecasting accuracy", workflow: "process_automation", businessFunction: "sales" },
    ],
  },
  {
    label: "Marketing",
    problems: [
      { label: "Campaign assembly", workflow: "marketing_automation", businessFunction: "marketing" },
      { label: "Lead nurturing", workflow: "marketing_automation", businessFunction: "marketing" },
      { label: "Reporting and attribution", workflow: "process_automation", businessFunction: "marketing" },
      { label: "List management", workflow: "marketing_automation", businessFunction: "marketing" },
      { label: "Content distribution", workflow: "marketing_automation", businessFunction: "marketing" },
      { label: "Landing page testing", workflow: "process_automation", businessFunction: "marketing" },
      { label: "Budget tracking", workflow: "process_automation", businessFunction: "marketing" },
      { label: "Webinar and event operations", workflow: "process_automation", businessFunction: "marketing" },
      { label: "SEO monitoring", workflow: "process_automation", businessFunction: "marketing" },
      { label: "Channel coordination", workflow: "process_automation", businessFunction: "marketing" },
    ],
  },
  {
    label: "Engineering",
    problems: [
      { label: "Slow CI/CD", workflow: "ci_cd", businessFunction: "engineering" },
      { label: "Manual deployments", workflow: "ci_cd", businessFunction: "engineering" },
      { label: "Long build and test cycles", workflow: "ci_cd", businessFunction: "engineering" },
      { label: "On-call triage", workflow: "ticketing", businessFunction: "engineering" },
      { label: "Ticket backlog", workflow: "ticketing", businessFunction: "engineering" },
      { label: "Documentation gaps", workflow: "process_automation", businessFunction: "engineering" },
      { label: "Dependency management", workflow: "process_automation", businessFunction: "engineering" },
      { label: "Incident reporting", workflow: "process_automation", businessFunction: "engineering" },
      { label: "Developer environment setup", workflow: "ci_cd", businessFunction: "engineering" },
      { label: "Code review bottlenecks", workflow: "process_automation", businessFunction: "engineering" },
    ],
  },
  {
    label: "Product",
    problems: [
      { label: "Feedback triage", workflow: "process_automation", businessFunction: "operations" },
      { label: "Roadmap reporting", workflow: "process_automation", businessFunction: "operations" },
      { label: "User research synthesis", workflow: "process_automation", businessFunction: "operations" },
      { label: "Requirements documentation", workflow: "process_automation", businessFunction: "operations" },
      { label: "Launch coordination", workflow: "process_automation", businessFunction: "operations" },
      { label: "Metric dashboards", workflow: "process_automation", businessFunction: "operations" },
      { label: "Competitor tracking", workflow: "process_automation", businessFunction: "operations" },
      { label: "Pricing analysis", workflow: "process_automation", businessFunction: "operations" },
      { label: "Feature adoption analysis", workflow: "process_automation", businessFunction: "operations" },
      { label: "Beta program operations", workflow: "process_automation", businessFunction: "operations" },
    ],
  },
  {
    label: "HR",
    problems: [
      { label: "Employee onboarding", workflow: "onboarding", businessFunction: "operations" },
      { label: "Time-off approvals", workflow: "process_automation", businessFunction: "operations" },
      { label: "Recruitment pipeline", workflow: "process_automation", businessFunction: "operations" },
      { label: "Payroll processing", workflow: "process_automation", businessFunction: "operations" },
      { label: "Performance reviews", workflow: "process_automation", businessFunction: "operations" },
      { label: "Compliance training", workflow: "process_automation", businessFunction: "operations" },
      { label: "Headcount reporting", workflow: "process_automation", businessFunction: "operations" },
      { label: "Employee data management", workflow: "process_automation", businessFunction: "operations" },
      { label: "Benefits administration", workflow: "process_automation", businessFunction: "operations" },
      { label: "Offboarding", workflow: "onboarding", businessFunction: "operations" },
    ],
  },
  {
    label: "Legal",
    problems: [
      { label: "Contract review backlog", workflow: "contract_review", businessFunction: "legal" },
      { label: "Clause extraction", workflow: "contract_review", businessFunction: "legal" },
      { label: "NDA processing", workflow: "contract_review", businessFunction: "legal" },
      { label: "Compliance tracking", workflow: "process_automation", businessFunction: "legal" },
      { label: "Document redlining", workflow: "process_automation", businessFunction: "legal" },
      { label: "Legal request intake", workflow: "process_automation", businessFunction: "legal" },
      { label: "Vendor agreements", workflow: "contract_review", businessFunction: "legal" },
      { label: "IP management", workflow: "process_automation", businessFunction: "legal" },
      { label: "Litigation support", workflow: "process_automation", businessFunction: "legal" },
      { label: "Policy updates", workflow: "process_automation", businessFunction: "legal" },
    ],
  },
  {
    label: "IT",
    problems: [
      { label: "Ticket triage", workflow: "ticketing", businessFunction: "operations" },
      { label: "Access requests", workflow: "process_automation", businessFunction: "operations" },
      { label: "Onboarding and offboarding", workflow: "onboarding", businessFunction: "operations" },
      { label: "Asset management", workflow: "process_automation", businessFunction: "operations" },
      { label: "Incident response", workflow: "ticketing", businessFunction: "operations" },
      { label: "Password resets", workflow: "process_automation", businessFunction: "operations" },
      { label: "Software provisioning", workflow: "process_automation", businessFunction: "operations" },
      { label: "Vendor support escalation", workflow: "ticketing", businessFunction: "operations" },
      { label: "Compliance audits", workflow: "process_automation", businessFunction: "operations" },
      { label: "Service reporting", workflow: "process_automation", businessFunction: "operations" },
    ],
  },
];

export const PEOPLE_RANGES = [
  "1–10",
  "10–25",
  "25–50",
  "50–100",
  "100–250",
  "250–500",
  "500–1,000",
  "1,000+",
] as const;

export interface IntakeOutcome {
  label: string;
  key: string;
}

export const OUTCOMES: IntakeOutcome[] = [
  { label: "Save time", key: "time" },
  { label: "Reduce cost", key: "cost" },
  { label: "Improve quality", key: "quality" },
  { label: "Increase revenue", key: "revenue" },
  { label: "Improve customer experience", key: "quality" },
  { label: "Reduce risk", key: "risk" },
  { label: "Improve compliance", key: "compliance" },
  { label: "Increase throughput", key: "efficiency" },
  { label: "Increase employee productivity", key: "efficiency" },
  { label: "Other", key: "efficiency" },
];

export const TIMELINES = [
  "Immediately",
  "30 days",
  "90 days",
  "6 months",
  "12 months",
  "Long-term strategic initiative",
] as const;

export function departmentByLabel(label: string): IntakeDepartment | undefined {
  return DEPARTMENTS.find((d) => d.label === label);
}

export function problemByLabel(department: string, label: string): IntakeProblem | undefined {
  return departmentByLabel(department)?.problems.find((p) => p.label === label);
}

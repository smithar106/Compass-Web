/**
 * Deterministic tech-stack recommendations.
 *
 * Given the engine's recommendation category (AI / Workflow_Automation /
 * Process_Redesign / Hybrid / Software), return 3–5 concrete tools with the
 * role each plays in the recommended process. This is a recommendation of
 * tooling — it does not claim the organization already uses these.
 *
 * Deterministic and explainable: the same category always yields the same
 * stack, so the brief is stable and never fabricates "what other companies
 * used" — it states what tooling would support this intervention.
 */

export interface TechItem {
  role: string;
  tool: string;
}

const STACKS: Record<string, TechItem[]> = {
  AI: [
    { role: "Recommended LLM", tool: "Claude by Anthropic" },
    { role: "Workflow / orchestration", tool: "n8n" },
    { role: "Document & data extraction", tool: "Google Document AI" },
    { role: "Hosting platform", tool: "Google Cloud Run" },
    { role: "Human review queue", tool: "Zendesk or internal case tool" },
  ],
  Workflow_Automation: [
    { role: "Process automation", tool: "UiPath" },
    { role: "Workflow orchestration", tool: "n8n" },
    { role: "Rules engine", tool: "AWS Step Functions" },
    { role: "System of record", tool: "Salesforce or ERP" },
    { role: "Monitoring", tool: "Grafana" },
  ],
  Process_Redesign: [
    { role: "Process mapping", tool: "Miro" },
    { role: "Workflow management", tool: "Asana or Monday.com" },
    { role: "Checklist / SOP", tool: "Notion" },
    { role: "System of record", tool: "Salesforce or ERP" },
    { role: "Analytics", tool: "Metabase" },
  ],
  Hybrid: [
    { role: "Recommended LLM", tool: "Claude by Anthropic" },
    { role: "Workflow / orchestration", tool: "n8n" },
    { role: "Rules engine", tool: "AWS Step Functions" },
    { role: "System of record", tool: "Salesforce or ERP" },
    { role: "Human review queue", tool: "Zendesk or internal case tool" },
  ],
  Software: [
    { role: "Core platform", tool: "Best-fit SaaS platform for the workflow" },
    { role: "Data & integration", tool: "Fivetran or native APIs" },
    { role: "System of record", tool: "Salesforce or ERP" },
    { role: "Analytics", tool: "Metabase or Looker" },
    { role: "Governance", tool: "SSO + role-based access" },
  ],
};

const DEFAULT_STACK = STACKS.Workflow_Automation;

/** Normalize engine category values to the stack keys above. */
function stackKey(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("ai") && c.includes("workflow")) return "Hybrid";
  if (c.includes("ai")) return "AI";
  if (c.includes("workflow") || c.includes("automation")) return "Workflow_Automation";
  if (c.includes("process") || c.includes("redesign")) return "Process_Redesign";
  if (c.includes("hybrid")) return "Hybrid";
  if (c.includes("software") || c.includes("implementation") || c.includes("platform")) return "Software";
  return "Workflow_Automation";
}

export function techStackFor(category: string): TechItem[] {
  return STACKS[stackKey(category)] ?? DEFAULT_STACK;
}

/**
 * Four qualitative reasons this intervention is the best fit — plain
 * business language, no evidence counts or tool mechanics.
 */
const REASONS: Record<string, string[]> = {
  AI: [
    "It automates the highest-volume part of the process, so the team stops spending time on repetitive work.",
    "It handles judgment-lite decisions consistently, reducing errors that come from manual handling.",
    "It keeps a human in the loop for the cases that genuinely need judgment, so accuracy stays high.",
    "It fits the organization's current process without requiring a large change to how people work today.",
  ],
  Workflow_Automation: [
    "It automates the repeated steps that slow the process down, returning time to the team.",
    "It enforces one consistent path, so the same work is done the same way every time.",
    "It works with the systems already in place, so it can start quickly without a big rebuild.",
    "It keeps clear rules and an audit trail, which makes the process transparent and easy to manage.",
  ],
  Process_Redesign: [
    "It removes the steps that cause delay and rework, so the process becomes simpler and faster.",
    "It fixes the underlying cause of the problem rather than adding another tool on top.",
    "It clarifies ownership and handoffs, so work stops being lost between teams.",
    "It is low-risk to start because it changes how people work before it changes systems.",
  ],
  Hybrid: [
    "It automates the predictable parts and keeps human judgment on the exceptions.",
    "It balances speed and quality, so results improve without losing control.",
    "It uses the existing process as the foundation, adding automation only where it clearly helps.",
    "It is flexible enough to adjust as the team learns what works in practice.",
  ],
  Software: [
    "It gives the team a single platform that replaces manual coordination and spreadsheets.",
    "It centralizes the process so status, ownership, and next steps are visible to everyone.",
    "It is configurable to the organization's workflow, so it fits rather than forcing a new process.",
    "It provides reporting and controls that make the process easier to run and improve.",
  ],
};

const DEFAULT_REASONS = REASONS.Workflow_Automation;

export function reasonsFor(category: string): string[] {
  const key = stackKey(category);
  return REASONS[key] ?? DEFAULT_REASONS;
}

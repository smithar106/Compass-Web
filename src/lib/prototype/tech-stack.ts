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

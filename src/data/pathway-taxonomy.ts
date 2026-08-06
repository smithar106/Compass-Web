// Canonical recommendation pathway taxonomy — single source of truth.
//
// The production engine emits a variety of category strings
// (e.g. "Process_Redesign", "Workflow Automation", "AI Implementation").
// Every pathway is forced through this enum before scoring, storage, API
// response, and rendering. Import this from Python-compatible JSON export too:
//   src/data/pathway-taxonomy.json

export type CanonicalPathway =
  | "AI"
  | "Workflow_Automation"
  | "Software"
  | "Process_Redesign"
  | "Staffing"
  | "Hybrid"
  | "No_Action";

export const CANONICAL_PATHWAYS: CanonicalPathway[] = [
  "AI",
  "Workflow_Automation",
  "Software",
  "Process_Redesign",
  "Staffing",
  "Hybrid",
  "No_Action",
];

/**
 * Map every recognizable alias (with arbitrary case/whitespace/spacing)
 * onto the canonical enum. Unknown values are kept as-is so callers can
 * surface them rather than silently invent a pathway.
 */
const ALIAS_MAP: Record<string, CanonicalPathway> = {
  "ai": "AI",
  "ai implementation": "AI",
  "ai-powered": "AI",
  "ai chatbot": "AI",
  "ai-assisted": "AI",
  "machine learning": "AI",
  "ml": "AI",
  "genai": "AI",
  "generative ai": "AI",
  "workflow automation": "Workflow_Automation",
  "workflow_automation": "Workflow_Automation",
  "workflow-automation": "Workflow_Automation",
  "process automation": "Workflow_Automation",
  "process_automation": "Workflow_Automation",
  "rpa": "Workflow_Automation",
  "intelligent process automation": "Workflow_Automation",
  "software": "Software",
  "deterministic software": "Software",
  "software implementation": "Software",
  "software_implementation": "Software",
  "low-code": "Software",
  "low code": "Software",
  "rule-based": "Software",
  "rule based": "Software",
  "saas": "Software",
  "cots": "Software",
  "process redesign": "Process_Redesign",
  "process_redesign": "Process_Redesign",
  "process-redesign": "Process_Redesign",
  "process re-engineering": "Process_Redesign",
  "re-engineering": "Process_Redesign",
  "reengineering": "Process_Redesign",
  "staffing": "Staffing",
  "staff augmentation": "Staffing",
  "hiring": "Staffing",
  "outsourcing": "Staffing",
  "hybrid": "Hybrid",
  "hybrid intervention": "Hybrid",
  "hybrid_implementation": "Hybrid",
  "ai-assisted with human review": "Hybrid",
  "human-in-the-loop": "Hybrid",
  "human in the loop": "Hybrid",
  "no action": "No_Action",
  "no_action": "No_Action",
  "status quo": "No_Action",
  "do nothing": "No_Action",
  "human work": "Staffing", // "Human Work" is a staffing intervention
};

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

const ALIAS_LOOKUP: Record<string, CanonicalPathway> = Object.fromEntries(
  Object.entries(ALIAS_MAP).map(([k, v]) => [normalizeToken(k), v])
);

export function canonicalizePathway(value: unknown): CanonicalPathway {
  if (typeof value !== "string") return "No_Action";
  const normalized = normalizeToken(value);
  if (!normalized) return "No_Action";
  const exact = ALIAS_LOOKUP[normalized];
  if (exact) return exact;
  // Partial match on leading words, e.g. "AI Implementation plan".
  for (const [token, mapped] of Object.entries(ALIAS_LOOKUP)) {
    if (normalized.startsWith(token)) return mapped;
  }
  if ((CANONICAL_PATHWAYS as string[]).includes(normalized)) {
    return normalized as CanonicalPathway;
  }
  return value as CanonicalPathway;
}

export const PATHWAY_LABELS: Record<CanonicalPathway, string> = {
  AI: "AI",
  Workflow_Automation: "Workflow Automation",
  Software: "Software",
  Process_Redesign: "Process Redesign",
  Staffing: "Staffing",
  Hybrid: "Hybrid",
  No_Action: "No Action",
};
/**
 * Decision-schema types for the Compass Decision prototype.
 *
 * The prototype is deterministic: every field maps to structured data in
 * `src/data/prototype/` (problem library + decision library), and the
 * recommendation layer (`src/lib/prototype/`) resolves a decision from a
 * problem id and optional context answers without any LLM call.
 *
 * Evidence provenance is explicit. Three tags are used throughout:
 *   REAL_EVIDENCE   — values that trace to the live evidence library or to
 *                     existing, supported fixtures (never invented here).
 *   ILLUSTRATIVE    — mock / prototype values clearly labeled as illustrative.
 *   PRODUCT_LOGIC   — product behavior and deterministic rules, not data.
 */

export type DecisionStatus =
  | "defensible"
  | "directionally_supported"
  | "needs_more_evidence";

export type EvidenceStrength = "strong" | "moderate" | "limited";

export type EvidenceTag = "REAL_EVIDENCE" | "ILLUSTRATIVE" | "PRODUCT_LOGIC";

export interface ImpactMetric {
  label: string;
  value: string;
  detail: string;
  tag: EvidenceTag;
}

export interface Alternative {
  name: string;
  whyRankedLower: string;
  verdict: "Rejected" | "Viable alternative" | "Deferred";
}

/** A concrete, declarative outcome a board can hear as a statement of fact. */
export interface ComparableExample {
  /** Full declarative sentence, e.g. "A mid-size SaaS company cut onboarding time 30% within 90 days." */
  statement: string;
}

export interface ImplementationPhase {
  phase: "Validate" | "Pilot" | "Deploy" | "Measure";
  summary: string;
  timeline: string;
  dependencies: string[];
}

export interface PrototypeRisk {
  title: string;
  detail: string;
  mitigation: string;
}

export interface MeasurementPlan {
  baseline: string;
  primaryKpi: string;
  secondaryKpis: string[];
  validationPoints: { at: string; check: string }[];
}

export interface PrototypeDecision {
  /** Stable problem id, matches a problem in the problem library. */
  id: string;
  /** Short problem name shown on cards and in the decision header. */
  problem: string;
  /** Category label, e.g. "Onboarding". */
  category: string;
  /** One-line description of the problem. */
  description: string;
  /** The recommended intervention. */
  recommendation: string;
  /** One-line strategy a CEO can state aloud, e.g. "Automate the standard path; keep humans on the exceptions." */
  strategy: string;
  /** Recommended tooling for the intervention: role/purpose + concrete tool. */
  techStack: { role: string; tool: string }[];
  decisionStatus: DecisionStatus;
  evidenceStrength: EvidenceStrength;
  implementationEffort: string;
  timeline: string;
  expectedImpact: string;
  /** 3–4 reasons why this intervention matches the problem. */
  whyThis: string[];
  impactMetrics: ImpactMetric[];
  /** Concrete comparable implementations (illustrative) a board can picture. */
  comparableExamples: ComparableExample[];
  /** Relevant implementation patterns drawn from comparable evidence. */
  evidencePatterns: string[];
  alternatives: Alternative[];
  implementationPlan: ImplementationPhase[];
  risks: PrototypeRisk[];
  measurement: MeasurementPlan;
  /** Conditions, missing evidence, or assumptions that could change the decision. */
  whatWouldChangeThis: string[];
  /** Board-ready narrative: problem → strategy → evidence → why this choice won. */
  decisionSummary: string;
  assumptions: string[];
  /** Provenance tag for the decision payload as a whole. */
  tag: EvidenceTag;
}

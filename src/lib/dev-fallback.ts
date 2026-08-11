/**
 * Development fallback: generates a deterministic mock recommendation
 * when the Compass Engine is unreachable. Let's the full assessment-to-
 * decision flow work without a running engine in dev mode.
 */

import type { DecisionRec } from "@/lib/decision-package";

export interface DevFallbackInput {
  business_function?: string;
  problem_statement?: string;
  desired_outcome?: string;
  standardization_level?: string;
  annual_workflow_volume?: string;
  constraint?: string;
}

export interface DevRecommendation {
  recommendation_id: string;
  generated_at: string;
  recommendations: DecisionRec[];
  assessment_summary: Record<string, unknown>;
  methodology: Record<string, unknown>;
}

const devStore = new Map<string, DevRecommendation>();

const STORE_MAX = 50;

function id(length = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "dev-";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function constraintTitle(constraint: string, fn: string): string {
  if (constraint === "capacity") return `Scale ${fn} throughput`;
  if (constraint === "errors") return `Reduce ${fn} error rate`;
  if (constraint === "speed") return `Accelerate ${fn} cycle time`;
  if (constraint === "cost") return `Optimize ${fn} cost structure`;
  if (constraint === "quality") return `Standardize ${fn} quality`;
  return `Modernize ${fn} operations`;
}

function readableProblem(stmt: string): string {
  const cleaned = stmt.replace(/_{1,}/g, " ").replace(/_/g, " ").trim();
  if (cleaned.length > 5) return cleaned;
  return "an operational workflow identified through the assessment";
}

function fnLabel(raw: string): string {
  const map: Record<string, string> = {
    finance: "Finance",
    customer_success: "Customer Success",
    human_resources: "HR",
    supply_chain: "Supply Chain",
    legal: "Legal",
    sales: "Sales",
    marketing: "Marketing",
    support: "Support",
    it: "IT",
    engineering: "Engineering",
    product: "Product",
    operations: "Operations",
    manufacturing: "Manufacturing",
  };
  return map[raw] || raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateDevFallback(input: DevFallbackInput): DevRecommendation {
  const fn = input.business_function || "operations";
  const fnDisplay = fnLabel(fn);
  const problem = readableProblem(input.problem_statement || "");
  const constraint = input.constraint || "";
  const title = constraintTitle(constraint, fnDisplay);
  const recId = id();

  const outcomeMetric =
    input.desired_outcome === "cost" ? "annual cost reduction"
    : input.desired_outcome === "time" ? "processing time reduction"
    : input.desired_outcome === "revenue" ? "revenue improvement"
    : "efficiency improvement";

  const outcomeRanges = [
    {
      metric_label: outcomeMetric,
      low: 20,
      high: 45,
      median: 32,
      sample_size: 18,
      unit: "%",
      directly_comparable: true,
    },
  ];

  const annualVolume = parseFloat(String(input.annual_workflow_volume || "0")) || 12000;
  const annualSavings = Math.round(annualVolume * 0.32 * 45);

  const result: DevRecommendation = {
    recommendation_id: recId,
    generated_at: new Date().toISOString(),
    recommendations: [
      {
        category: "Workflow_Automation",
        title,
        rationale: `Evidence from ${fnDisplay} implementations suggests measurable improvement is achievable. The assessment identified ${problem} as an area where process redesign and targeted automation can reduce manual effort and improve consistency.`,
        confidence: {
          score: 0.72,
          label: "moderate",
          explanation: `Evidence from comparable ${fnDisplay} implementations supports this direction.`,
        },
        evidence_summary: {
          overall_tier: "silver",
          total_comparables: 18,
          gold_count: 3,
          silver_count: 10,
          bronze_count: 5,
          average_evidence_score: 56,
        },
        outcome_ranges: outcomeRanges,
        comparable_implementations: [
          {
            organization: "Acme Corp",
            intervention: `Process redesign in ${fnDisplay}`,
            outcome_summary: `${outcomeMetric} improved by 38%`,
            evidence_tier: "gold",
            similarity_score: 68,
          },
          {
            organization: "Beta Inc",
            intervention: `Automation in ${fnDisplay} operations`,
            outcome_summary: "Cycle time reduced 42%",
            evidence_tier: "silver",
            similarity_score: 55,
          },
          {
            organization: "Delta Systems",
            intervention: `Workflow restructuring in ${fnDisplay}`,
            outcome_summary: "Processing cost down 31% within 90 days",
            evidence_tier: "silver",
            similarity_score: 51,
          },
        ],
        risks: [
          {
            title: "Adoption resistance",
            explanation: "Teams may resist process changes if not involved early.",
            mitigation: "Include frontline staff in the pilot design phase.",
          },
          {
            title: "Exception handling gaps",
            explanation: "Automation may miss edge cases.",
            mitigation: "Keep a human review queue for flagged exceptions.",
          },
        ],
        assumptions_detail: [
          {
            title: "Volume remains stable",
            explanation: "If workflow volume drops significantly, ROI projections may shift.",
          },
        ],
        information_gaps: [],
        alternatives_considered: [
          {
            family: "Full automation without human review",
            reason: "Evidence is thinner for fully autonomous systems in this domain.",
          },
          {
            family: "Status quo with incremental improvements",
            reason: "Incremental changes alone are unlikely to deliver the target outcome.",
          },
        ],
        why_ranked_first: {
          supporting_reasons: [
            "Strongest comparable evidence",
            "Clear implementation path with measurable milestones",
            "Aligns with assessment constraints and desired outcomes",
          ],
        },
        next_validation_step: {
          action: "Establish baseline metrics",
          purpose: "Lock current-state metrics before beginning the pilot.",
          success_criteria: "Baseline captured within 10% tolerance",
          owner: `${fnDisplay} Operations Lead`,
          duration: "2 weeks",
        },
        impact: {
          annual_savings: {
            status: "estimated",
            low: Math.round(annualSavings * 0.7),
            expected: annualSavings,
            high: Math.round(annualSavings * 1.3),
            currency: "USD",
          },
          implementation_timeline: {
            min_weeks: 6,
            max_weeks: 14,
            expected_weeks: 10,
          },
        },
      },
    ],
    assessment_summary: {
      business_function: fn,
      problem_statement: problem,
    },
    methodology: {
      evidence_count: { unique_organizations: 18 },
    },
  };

  storeDevRecommendation(result);
  return result;
}

export function storeDevRecommendation(rec: DevRecommendation): void {
  devStore.set(rec.recommendation_id, rec);
  if (devStore.size > STORE_MAX) {
    const first = devStore.keys().next().value;
    if (first) devStore.delete(first);
  }
}

export function getDevRecommendation(recId: string): DevRecommendation | null {
  return devStore.get(recId) ?? null;
}

export function isDevRec(recId: string): boolean {
  return recId.startsWith("dev-");
}


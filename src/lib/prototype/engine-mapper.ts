/**
 * Mapper: live engine recommendation payload → PrototypeDecision schema.
 *
 * The board-presentation UI consumes PrototypeDecision; this maps the engine's
 * ranked-recommendation response onto that schema so the UI does not change.
 *
 * Honesty rules:
 *   - Thin problems (fewer than the structured problem's minCitable) return
 *     a decision with decisionStatus = "needs_more_evidence" and NO fabricated
 *     comparableExamples — the engine's real information_gaps / next step are
 *     surfaced instead.
 *   - Comparable examples are rendered as declarative sentences (org +
 *     intervention + observed outcome) — never as "N comparable
 *     implementations".
 */

import type { PrototypeDecision, PrototypeRisk, EvidenceTag } from "@/types/prototype";
import type { StructuredProblem } from "./problem-definitions";
import { techStackFor, reasonsFor } from "./tech-stack";

export interface EngineComparable {
  organization?: string;
  intervention?: string;
  intervention_description?: string;
  outcome_summary?: string;
  observed_outcome?: string;
  normalized_metrics?: { metric?: string; value?: string }[];
}

export interface EngineRecommendation {
  rank?: number;
  title?: string;
  category?: string;
  description?: string;
  specific_action?: string;
  specific_intervention?: { title?: string; description?: string };
  confidence?: { score?: number; label?: string; explanation?: string };
  evidence_summary?: { overall_tier?: string; total_comparables?: number };
  why_ranked_first?: { summary?: string; supporting_reasons?: string[] };
  alternatives_considered?: { family?: string; reason?: string; confidence_score?: number }[];
  risks?: { title?: string; explanation?: string; mitigation?: string }[];
  assumptions_detail?: { title?: string; explanation?: string }[];
  information_gaps?: { title?: string; explanation?: string }[];
  next_validation_step?: {
    action?: string;
    purpose?: string;
    duration?: string;
    success_criteria?: string;
  };
  comparable_implementations?: EngineComparable[];
}

export interface EngineResponse {
  recommendations?: EngineRecommendation[];
  scored_interventions?: unknown[];
  information_gaps?: { title?: string; explanation?: string }[];
  next_validation_steps?: unknown[];
  impact_summary?: { headline?: string };
  methodology?: {
    evidence_count?: {
      comparable_implementations?: number;
      unique_organizations?: number;
      quantified_outcome_implementations?: number;
      outcome_measured_implementations?: number;
    };
  };
}

const STATUS_FOR_CONFIDENCE = (score: number | undefined): PrototypeDecision["decisionStatus"] => {
  if (score == null) return "needs_more_evidence";
  if (score >= 0.6) return "defensible";
  if (score >= 0.4) return "directionally_supported";
  return "needs_more_evidence";
};

function declarativeExample(c: EngineComparable): string | null {
  const org = c.organization || "";
  const intervention = c.intervention || c.intervention_description || "";
  const outcome = c.outcome_summary || c.observed_outcome || "";
  if (!org && !intervention) return null;
  const outcomeSnippet = outcome.replace(/\s+/g, " ").slice(0, 120);
  if (org && intervention && outcomeSnippet) {
    return `${org} ${intervention.toLowerCase().startsWith("implement") ? intervention : `implemented ${intervention}`}${outcomeSnippet ? ` — ${outcomeSnippet.toLowerCase().startsWith(" ") ? outcomeSnippet.trim() : outcomeSnippet}` : ""}.`;
  }
  if (org && intervention) return `${org} implemented ${intervention}.`;
  return null;
}

function impactDirection(metricName: string): string {
  const down = /cycle|time|cost|error|rework|handling|turnaround|close|processing/i;
  const up = /throughput|productivity|output|revenue|satisfaction|adoption|capacity|speed/i;
  const name = metricName.toLowerCase();
  if (up.test(name)) return "improvement in";
  if (down.test(name)) return "reduction in";
  return "improvement in";
}

function metricFromComparables(cs: EngineComparable[]): { label: string; value: string; detail: string; tag: EvidenceTag }[] {
  const metrics = new Map<string, string>();
  for (const c of cs) {
    for (const m of c.normalized_metrics || []) {
      const name = (m.metric || "").trim();
      const val = (m.value || "").trim();
      if (name && val && !metrics.has(name)) {
        metrics.set(name, val);
      }
    }
  }
  const out: { label: string; value: string; detail: string; tag: EvidenceTag }[] = [];
  let i = 0;
  for (const [name, val] of metrics) {
    out.push({
      label: name,
      value: val,
      detail: `${impactDirection(name)} ${name.toLowerCase()}`,
      tag: "REAL_EVIDENCE",
    });
    if (++i >= 4) break;
  }
  return out;
}

/** Build a declarative impact headline, e.g. "83% reduction in processing time". */
function impactHeadline(cs: EngineComparable[]): string {
  const m = metricFromComparables(cs)[0];
  if (!m) return "See expected impact";
  const dir = m.detail || `impact on ${m.label.toLowerCase()}`;
  return `${m.value} ${dir}`;
}

export function mapEngineToDecision(
  problem: StructuredProblem,
  response: EngineResponse
): PrototypeDecision {
  const rec = response.recommendations?.[0];
  const comparables = rec?.comparable_implementations ?? [];
  const confidenceScore = rec?.confidence?.score;
  const status = STATUS_FOR_CONFIDENCE(confidenceScore);
  // Use the richer methodology count (actual retrieved comparables) for the
  // thin check — the displayed comparable_implementations is a display cap.
  const retrievedCount =
    response.methodology?.evidence_count?.comparable_implementations ??
    comparables.length;
  const thin = retrievedCount < problem.minCitable;

  // Reasons are qualitative business statements keyed by intervention
  // category — never evidence counts, tiers, or tool mechanics.
  const whyThis: string[] = reasonsFor(rec?.category || "Workflow_Automation");

  const alternatives = (rec?.alternatives_considered ?? []).slice(0, 2).map((a) => ({
    name: a.family || "Alternative",
    whyRankedLower: a.reason || "Did not rank as the strongest option.",
    verdict: "Rejected" as const,
  }));

  const risks: PrototypeRisk[] = (rec?.risks ?? []).slice(0, 4).map((r) => ({
    title: r.title || "Risk",
    detail: r.explanation || "",
    mitigation: r.mitigation || "",
  }));

  const comparableExamples = thin
    ? []
    : comparables
        .slice(0, 3)
        .map(declarativeExample)
        .filter((s): s is string => Boolean(s))
        .map((statement) => ({ statement }));

  const measurement = {
    baseline: "Current baseline measured before implementation begins.",
    primaryKpi: rec?.next_validation_step?.success_criteria || "Agreed success criteria",
    secondaryKpis: ["Cycle time", "Manual effort", "Error / rework"],
    validationPoints: [
      { at: "Day 30", check: "Validate the process baseline and pilot setup." },
      { at: "Day 60", check: "Check early outcome trend against the baseline." },
      { at: "Day 90", check: "Measure against the agreed success criteria." },
    ],
  };

  const informationGaps = (rec?.information_gaps ?? response.information_gaps ?? []).slice(0, 3);
  const whatWouldChangeThis: string[] = [];
  for (const g of informationGaps) {
    whatWouldChangeThis.push(`${g.title || "Additional evidence"}: ${g.explanation || ""}`.trim());
  }
  whatWouldChangeThis.push(
    "If the organization's context differs materially from the evidence base, the recommendation may change."
  );

  const decisionSummary = thin
    ? `Compass found ${retrievedCount} comparable implementations for this problem — enough to be directionally helpful, but not enough for a fully defensible recommendation. More evidence would strengthen this decision.`
    : (() => {
        const recTitle =
          rec?.specific_intervention?.title ||
          rec?.title ||
          "The recommended intervention";
        const reasons = reasonsFor(rec?.category || "Workflow_Automation");
        const firstReason = reasons[0]?.replace(/^It /i, "It ");
        return `${recTitle} is the strongest option for this problem. ${firstReason ? firstReason.charAt(0).toUpperCase() + firstReason.slice(1) : ""}`.trim();
      })();

  return {
    id: problem.id,
    problem: problem.problemStatement.split(";")[0].trim(),
    category: rec?.category || "Operations",
    description: problem.problemStatement,
    recommendation: thin
      ? "Recommendation needs more evidence"
      : rec?.specific_intervention?.title ||
        rec?.title ||
        rec?.specific_action ||
        "Recommendation requires more evidence.",
    strategy: thin
      ? "The evidence base is too thin for a defensible recommendation. Additional comparable implementations would clarify the best intervention."
      : rec?.specific_action ||
        rec?.specific_intervention?.description ||
        "Address the root cause with the strongest comparable evidence.",
    techStack: techStackFor(rec?.category || "Workflow_Automation"),
    decisionStatus: thin ? "needs_more_evidence" : status,
    evidenceStrength: (rec?.evidence_summary?.overall_tier === "gold" || rec?.evidence_summary?.overall_tier === "decision_grade")
      ? "strong"
      : rec?.evidence_summary?.overall_tier === "supporting"
        ? "moderate"
        : "limited",
    implementationEffort: "Medium",
    timeline: rec?.next_validation_step?.duration || "Weeks 1–12",
    expectedImpact: impactHeadline(comparables),
    whyThis,
    impactMetrics: metricFromComparables(comparables),
    comparableExamples,
    evidencePatterns: [],
    alternatives,
    implementationPlan: [
      { phase: "Validate", summary: "Confirm the current process baseline and the comparable evidence applies.", timeline: "Weeks 1–3", dependencies: ["Baseline metrics", "Evidence review"] },
      { phase: "Pilot", summary: "Run the intervention on a controlled segment.", timeline: "Weeks 4–7", dependencies: ["Pilot scope", "Owner"] },
      { phase: "Deploy", summary: "Scale with agreed success criteria.", timeline: "Weeks 8–11", dependencies: ["Pilot results", "Training"] },
      { phase: "Measure", summary: "Track the primary KPI against the baseline.", timeline: "Weeks 12–14", dependencies: ["Dashboards", "Success criteria"] },
    ],
    risks: risks.length ? risks : [{ title: "Implementation varies by organization", detail: "Results depend on execution and context.", mitigation: "Run a controlled pilot and measure." }],
    measurement,
    whatWouldChangeThis,
    decisionSummary,
    assumptions: (rec?.assumptions_detail ?? []).slice(0, 3).map((a) => a.title || "Assumption"),
    tag: "REAL_EVIDENCE" as EvidenceTag,
  };
}

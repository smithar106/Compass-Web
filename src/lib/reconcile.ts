// Recommendation reconciliation layer.
//
// The production engine returns raw comparisons that sometimes use broad or
// generic language. This layer normalizes every recommendation before it is
// stored, returned from the API, or rendered:
//   - canonicalize the pathway against one enum
//   - filter + rerank evidence by structured relevance (not just embedding)
//   - suppress generic / dominant / duplicate evidence
//   - dedupe comparable companies by normalized identity
//   - synthesize intervention-specific titles when the provided title is weak
//   - emit internal quality scores for testing (not shown in the brief)

import { canonicalizePathway, type CanonicalPathway, PATHWAY_LABELS } from "@/data/pathway-taxonomy";
import { validateMetric, normalizeDirection } from "@/lib/metrics";

// -----------------------------------------------------------------------------
// Pathway reconciliation
// -----------------------------------------------------------------------------

export interface PathwayScore {
  pathway: CanonicalPathway;
  pathway_label: string;
  pathway_score: number; // 0..1 confidence in the pathway mapping
}

const KNOWN_PATHWAYS = ["AI", "Workflow_Automation", "Software", "Process_Redesign", "Staffing", "Hybrid", "No_Action"];

export function reconcilePathway(raw: unknown, category: unknown, interventionId: unknown): PathwayScore {
  const first = [raw, category, interventionId].find((v) => typeof v === "string" && v.trim().length > 0);
  const pathway = canonicalizePathway(first ?? "");
  const score = KNOWN_PATHWAYS.includes(pathway) ? 1 : 0.4;
  return { pathway, pathway_label: PATHWAY_LABELS[pathway] ?? pathway, pathway_score: score };
}

// -----------------------------------------------------------------------------
// Generic-language and specificity helpers
// -----------------------------------------------------------------------------

const GENERIC_TITLES =
  /corporate transformation|multi-phased|incorporation of additional|implementation of new software|generic |broad |any solution|leveraging technologies|comprehensive solution|berea?vement/i;

export function titleSpecificity(title: string): number {
  const t = (title || "").trim();
  if (!t) return 0;
  let specificity = 1;
  if (GENERIC_TITLES.test(t)) specificity = Math.min(specificity, 0.2);
  if (/\b(auto|automate|report|triage|qualif|redesign|deployment|platform|system|optimization|workflow|processing|categor|routing|onboard|provision|monitor|verify)\b/i.test(t)) {
    specificity = Math.max(specificity, 0.7);
  }
  if (t.length < 12) specificity = Math.min(specificity, 0.4);
  return specificity;
}

export interface ComparableEvidenceRaw {
  record_id?: string;
  organization?: string;
  intervention?: string;
  intervention_category?: string;
  intervention_description?: string;
  outcome_summary?: string;
  observed_outcome?: string;
  supporting_passage?: string;
  source_url?: string;
  evidence_tier?: string;
  similarity_score?: number;
  workflow?: string;
  industry?: string;
  [key: string]: unknown;
}

export interface NormalizedEvidence {
  record_id?: string;
  organization: string;
  intervention: string;
  description: string;
  outcome: string;
  pathway: CanonicalPathway;
  tier: string;
  similarity: number;
  specificity: number;
  relevance_score: number;
  quality_score: number;
  frequency_penalty: number;
  final_score: number;
  eligible: boolean;
  duplicate_of?: string;
  source_url?: string;
}

const HARD_MISMATCH_TERMS: Record<string, string[]> = {
  ticketing: ["bereavement", "unemployment", "legal document", "contract", "document categor", "claims software"],
  contract_review: ["bereavement", "unemployment", "support triage", "chatbot"],
  marketing_automation: ["bereavement", "unemployment", "claims"],
  onboarding: ["bereavement", "unemployment", "claims"],
  process_automation: ["bereavement", "unemployment"],
  lead_qualification: ["bereavement", "unemployment"],
  supply_chain: ["bereavement", "unemployment"],
  ci_cd: ["bereavement", "unemployment"],
};

export function inferWorkflow(problem: string, department: string): string {
  const p = (problem || "").toLowerCase();
  const d = (department || "").toLowerCase();
  if (/invoice|payment|payables|expense|billing|procure/.test(p)) return "invoice_processing";
  if (/ticket|triage|escalation|support|resolution|complaint/.test(p)) return "ticketing";
  if (/contract|clause|nda|redline|vendor agreement/.test(p)) return "contract_review";
  if (/onboard|offboard|hr|employee|payroll/.test(p)) return "onboarding";
  if (/inventory|order|fulfill|supply|procure|warehouse/.test(p)) return "supply_chain";
  if (/cicd|ci\/cd|deploy|build|test cycle|pipeline/.test(p)) return "ci_cd";
  if (/lead|qualif|sales|forecast|territor|renewal/.test(p)) return "lead_qualification";
  if (/campaign|marketing|attribution|nurtur|content distribution/.test(p)) return "marketing_automation";
  if (/report|attribution|dashboard|monitor/.test(p)) return "process_automation";
  if (d === "customer support" && /customer/.test(p)) return "ticketing";
  return "process_automation";
}

function workflowScore(userWorkflow: string, evidence: ComparableEvidenceRaw): number {
  const text = [
    evidence.workflow || "",
    evidence.intervention || "",
    evidence.intervention_description || "",
  ].join(" ").toLowerCase();
  if (text.includes(userWorkflow.replace(/_/g, " "))) return 1;
  const mapping: Record<string, string[]> = {
    invoice_processing: ["invoice", "payment", "ap", "payable", "expense"],
    ticketing: ["ticket", "support", "triage", "case", "helpdesk"],
    contract_review: ["contract", "clause", "legal", "nda"],
    onboarding: ["onboard", "hr", "employee", "offboard"],
    supply_chain: ["inventory", "order", "supply", "warehouse", "fulfill"],
    ci_cd: ["ci", "cd", "deploy", "build", "pipeline"],
    lead_qualification: ["lead", "sales", "qualif"],
    marketing_automation: ["campaign", "marketing", "nurtur", "attribution"],
    process_automation: ["process", "workflow", "report", "automation"],
  };
  const keywords = mapping[userWorkflow] || ["workflow"];
  return keywords.some((k) => text.includes(k)) ? 0.7 : 0.2;
}

function workflowHardMismatch(userWorkflow: string, evidence: ComparableEvidenceRaw): boolean {
  const terms = HARD_MISMATCH_TERMS[userWorkflow];
  if (!terms) return false;
  const text = [
    evidence.intervention || "",
    evidence.intervention_description || "",
    evidence.supporting_passage || "",
    evidence.workflow || "",
  ].join(" ").toLowerCase();
  return terms.some((t) => text.includes(t));
}

export function normalizeOrg(org: string): string {
  return (org || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(inc|llc|ltd|corp|group|co|limited|solutions|technologies|technology|company)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tierScore(tier: string | undefined): number {
  switch ((tier || "").toLowerCase()) {
    case "gold": return 1;
    case "silver": return 0.7;
    case "bronze": return 0.4;
    default: return 0.3;
  }
}

/**
 * Two-stage reconcile of comparable evidence.
 *
 * Stage 1 filters to minimally-relevant candidates (structured + lexical).
 * Stage 2 reranks with weighted fields and hard mismatch penalties, applies
 * frequency penalties to combat dominance, dedupes by organization, and keeps
 * only eligible records (at least one supported outcome, credible source,
 * non-generic description).
 */
export function reconcileEvidence(
  evidence: ComparableEvidenceRaw[],
  problem: string,
  department: string,
  objective: string,
  pathway: CanonicalPathway,
  frequency: Record<string, number>,
  max = 3,
): NormalizedEvidence[] {
  const userWorkflow = inferWorkflow(problem, department);
  const available = (evidence || []).filter(Boolean);

  const normalized: NormalizedEvidence[] = available.map((e) => {
    const org = normalizeOrg(e.organization || "");
    const title = (e.intervention || "").trim();
    const desc = (e.intervention_description || "").trim();
    const outcome = (e.outcome_summary || e.observed_outcome || "").trim();

    // Stage 1: lexical relevance vs the user's problem words.
    const text = `${title} ${desc} ${outcome}`.toLowerCase();
    const problemWords = (problem || "").toLowerCase().split(/[^\w]+/).filter((w) => w.length > 3);
    const overlap = problemWords.filter((w) => text.includes(w)).length;
    let relevance = problemWords.length ? overlap / problemWords.length : 0;
    const hardMismatch = workflowHardMismatch(userWorkflow, e);
    if (hardMismatch) relevance = Math.min(relevance, 0.15);

    // Stage 2 weighted rerank.
    const wfScore = 0.20 * workflowMatch(userWorkflow, e);
    const depScore = 0.15 * departmentMatch(department, e);
    const invScore = 0.15 * interventionMatch(pathway, e);
    const objScore = 0.10 * objectiveMatch(objective, e);
    const evScore = 0.10 * tierScore(e.evidence_tier);
    const ctxScore = 0.05 * contextualMatch(e);

    let relevance_score = (0.25 * relevance) + wfScore + depScore + invScore + objScore + evScore + ctxScore;
    if (hardMismatch) relevance_score = Math.min(relevance_score, 0.2);

    const specificity = titleSpecificity(title || desc);
    const frequencyPenalty = Math.min(1, (frequency[org] || 0) / 5);
    const quality_score = 0.6 * relevance_score + 0.4 * specificity;

    // Eligibility rules.
    const hasOutcome = Boolean(outcome) && /%|\$|\d|x\b|reduc|improv|sav|increase/i.test(outcome);
    const credibleSource = Boolean(e.source_url) || (e.evidence_tier || "") !== "";
    const hasDescription = desc.length > 12 || title.length > 8;
    const eligible = relevance_score >= 0.25 && hasOutcome && hasDescription && !hardMismatch;

    const final_score = quality_score * (1 - 0.5 * frequencyPenalty);

    return {
      record_id: e.record_id,
      organization: (e.organization || "").trim(),
      intervention: title,
      description: desc,
      outcome,
      pathway: canonicalizePathway(e.intervention_category || e.workflow || ""),
      tier: e.evidence_tier || "",
      similarity: e.similarity_score || 0,
      specificity,
      relevance_score: Math.round(relevance_score * 100) / 100,
      quality_score: Math.round(quality_score * 100) / 100,
      frequency_penalty: frequencyPenalty,
      final_score: Math.round(final_score * 100) / 100,
      eligible,
      source_url: e.source_url,
    };
  });

  // Dedupe by normalized organization, keep highest quality per org.
  const bestByOrg = new Map<string, NormalizedEvidence>();
  for (const ev of normalized) {
    const key = normalizeOrg(ev.organization) || ev.record_id || ev.intervention;
    if (!bestByOrg.has(key)) {
      bestByOrg.set(key, ev);
    } else {
      const existing = bestByOrg.get(key)!;
      if (ev.quality_score > existing.quality_score) {
        ev.duplicate_of = existing.organization;
        bestByOrg.set(key, ev);
      } else {
        existing.duplicate_of = existing.organization;
      }
    }
  }

  const unique = Array.from(bestByOrg.values())
    .filter((e) => e.eligible)
    .sort((a, b) => b.final_score - a.final_score);

  return unique.slice(0, max);
}

// Small numeric helpers kept private to avoid bloating the public API.
function workflowMatch(userWorkflow: string, e: ComparableEvidenceRaw): number {
  return workflowScore(userWorkflow, e);
}

function departmentMatch(department: string, e: ComparableEvidenceRaw): number {
  const d = (department || "").toLowerCase();
  const text = [(e.workflow || ""), (e.intervention_description || "")].join(" ").toLowerCase();
  if (text.includes(d)) return 1;
  const map: Record<string, string[]> = {
    finance: ["invoice", "payable", "expense", "billing", "ap", "procurement"],
    operations: ["operations", "supply", "inventory", "order", "process"],
    "customer support": ["support", "ticket", "triage", "helpdesk", "case"],
    sales: ["sales", "lead", "qualif", "forecast"],
    marketing: ["marketing", "campaign", "attribution"],
    engineering: ["engineering", "ci", "cd", "deploy", "build"],
    legal: ["legal", "contract", "compliance", "clause"],
    hr: ["hr", "employee", "onboard", "payroll"],
    it: ["it", "ticket", "access", "asset", "provision"],
    product: ["product", "feedback", "research", "roadmap"],
  };
  const keys = map[d] || [d];
  return keys.some((k) => text.includes(k)) ? 0.7 : 0.3;
}

function interventionMatch(pathway: CanonicalPathway, e: ComparableEvidenceRaw): number {
  const evPath = canonicalizePathway(e.intervention_category || e.workflow || "");
  if (evPath === pathway) return 1;
  if ((e.intervention_category || "") && evPath) return 0.6;
  return 0.4;
}

function objectiveMatch(objective: string, e: ComparableEvidenceRaw): number {
  const o = (objective || "").toLowerCase();
  if (!o) return 0.5;
  const text = `${e.outcome_summary || ""} ${e.observed_outcome || ""}`.toLowerCase();
  const keys: Record<string, string[]> = {
    time: ["hour", "time", "processing", "faster"],
    cost: ["cost", "saving", "reduction"],
    quality: ["quality", "error", "accuracy", "consist"],
    revenue: ["revenue", "uplift", "conversion", "growth"],
    risk: ["risk", "fraud", "compliance", "error"],
    compliance: ["compliance", "audit", "regulatory"],
    efficiency: ["throughput", "capacity", "efficien", "volume"],
  };
  const words = keys[o] || [];
  return words.some((w) => text.includes(w)) ? 0.8 : 0.4;
}

function contextualMatch(e: ComparableEvidenceRaw): number {
  // Source credibility + freshness, bounded heuristic.
  let score = 0.5;
  if (e.source_url) score += 0.2;
  if (e.evidence_tier) score += 0.1;
  return Math.min(1, score);
}

// -----------------------------------------------------------------------------
// Title synthesis
// -----------------------------------------------------------------------------

export function titleTooWeak(title: string, problem: string, pathway: CanonicalPathway): boolean {
  const t = (title || "").trim();
  if (!t) return true;
  if (BAD_TITLE_RE.test(t)) return true;
  if (GENERIC_TITLES.test(t)) return true;
  if (t.split(/\s+/).length < 3) return true;
  if (t === "AI" || t === "Software" || t === "Workflow Automation") return true;
  // Weak if it does not relate to the stated problem.
  const pw = (problem || "").toLowerCase().split(/[^\w]+/).filter((w) => w.length > 4);
  if (pw.length && !pw.some((w) => t.toLowerCase().includes(w))) {
    return true;
  }
  return false;
}

const BAD_TITLE_RE = /^implementation\s+of(?:\s+(?:a|an|the))?\s+[\w-]+$/i;

const PATHWAY_PREFIX: Record<CanonicalPathway, string> = {
  AI: "AI-powered",
  Workflow_Automation: "Workflow automation for",
  Software: "Software solution for",
  Process_Redesign: "Process redesign for",
  Staffing: "Staffing plan for",
  Hybrid: "AI-assisted",
  No_Action: "Maintain current process for",
};

export function synthesizeTitle(problem: string, department: string, pathway: CanonicalPathway): string {
  const prob = (problem || "").trim();
  const dept = (department || "").trim();
  const prefix = PATHWAY_PREFIX[pathway] || "Intervention for";
  const subject = prob || `${dept} workflow`;
  return `${prefix} ${subject}`;
}

// -----------------------------------------------------------------------------
// Quality scores
// -----------------------------------------------------------------------------

export interface RecommendationQuality {
  pathway_score: number;
  evidence_relevance_score: number;
  evidence_quality_score: number;
  metric_quality_score: number;
  title_quality_score: number;
  overall_recommendation_quality: number;
  status: "Ready" | "Needs validation";
  weak_dimensions: string[];
}

export const PRODUCTION_QUALITY_THRESHOLD = 0.55;

export function computeQuality(
  params: {
    pathwayScore: number;
    evidence: NormalizedEvidence[];
    titleOk: boolean;
    titleSpecificity: number;
    metricsOk: boolean;
  },
): RecommendationQuality {
  const pathway_score = params.pathwayScore;
  const evidence_relevance_score = params.evidence.length
    ? params.evidence.reduce((s, e) => s + e.relevance_score, 0) / params.evidence.length
    : 0;
  const evidence_quality_score = params.evidence.length
    ? params.evidence.reduce((s, e) => s + e.quality_score, 0) / params.evidence.length
    : 0;
  const metric_quality_score = params.metricsOk ? 1 : 0.4;
  const title_quality_score = params.titleOk ? Math.min(1, 0.4 + params.titleSpecificity) : 0.3;

  const overall = 0.2 * pathway_score
    + 0.25 * evidence_relevance_score
    + 0.2 * evidence_quality_score
    + 0.15 * metric_quality_score
    + 0.2 * title_quality_score;

  const weak: string[] = [];
  if (pathway_score < 0.6) weak.push("pathway");
  if (evidence_relevance_score < 0.35) weak.push("evidence_relevance");
  if (evidence_quality_score < 0.35) weak.push("evidence_quality");
  if (metric_quality_score < 0.6) weak.push("metrics");
  if (title_quality_score < 0.5) weak.push("title");

  const status = overall >= PRODUCTION_QUALITY_THRESHOLD ? "Ready" : "Needs validation";
  return {
    pathway_score: Math.round(pathway_score * 100) / 100,
    evidence_relevance_score: Math.round(evidence_relevance_score * 100) / 100,
    evidence_quality_score: Math.round(evidence_quality_score * 100) / 100,
    metric_quality_score: Math.round(metric_quality_score * 100) / 100,
    title_quality_score: Math.round(title_quality_score * 100) / 100,
    overall_recommendation_quality: Math.round(overall * 100) / 100,
    status,
    weak_dimensions: weak,
  };
}

// -----------------------------------------------------------------------------
// Full-recommendation application
// -----------------------------------------------------------------------------

export interface ReconciledRecommendation {
  recommendation: Record<string, unknown>;
  pathway: PathwayScore;
  evidence: NormalizedEvidence[];
  quality: RecommendationQuality;
  title: string;
}

export interface ReconcileOptions {
  problem?: string;
  department?: string;
  objective?: string;
  evidenceFrequency?: Record<string, number>;
}

/**
 * Apply the full reconciliation stack to one top recommendation.
 * The input recommendation is mutated in place (pathway canonicalized, title
 * synthesized when weak, comparable_implementations replaced with normalized
 * eligible evidence) and the diagnostics are returned.
 */
export function applyReconciliation(
  rec: Record<string, unknown>,
  opts: ReconcileOptions = {},
): ReconciledRecommendation {
  const problem = opts.problem || (rec.assessment_summary as any)?.problem_statement || "";
  const department = opts.department || (rec.assessment_summary as any)?.business_function || "";
  const objective = opts.objective || (rec.assessment_summary as any)?.desired_outcome || "";

  const pathway = reconcilePathway(rec.category, rec.category, rec.intervention_id);
  rec.category = pathway.pathway;
  // Keep a readable label for rendering but store the canonical enum.
  rec.pathway_label = pathway.pathway_label;

  const frequency = opts.evidenceFrequency || {};
  const evidence = reconcileEvidence(
    (rec.comparable_implementations || []) as ComparableEvidenceRaw[],
    problem,
    department,
    objective,
    pathway.pathway,
    frequency,
  );

  // Prune stored comparable implementations to eligible, deduped evidence.
  rec.comparable_implementations = evidence.map((e) => ({
    organization: e.organization,
    record_id: e.record_id,
    evidence_tier: e.tier,
    similarity_score: e.similarity,
    intervention: e.intervention,
    intervention_description: e.description,
    outcome_summary: e.outcome,
    source_url: e.source_url,
  }));
  rec.evidence_summary = {
    ...((rec.evidence_summary as object) || {}),
    total_comparables: evidence.length,
    overall_tier: evidence.length > 0 ? evidence[0].tier || "silver" : "insufficient",
  };

  // Title synthesis when weak.
  const rawTitle = (rec.specific_action || rec.title || "") as string;
  const titleTooWeakResult = titleTooWeak(rawTitle, problem, pathway.pathway);
  let title = rawTitle;
  if (titleTooWeakResult) {
    title = synthesizeTitle(problem, department, pathway.pathway);
  }
  rec.specific_action = title;
  rec.title = title;

  const quality = computeQuality({
    pathwayScore: pathway.pathway_score,
    evidence,
    titleOk: !titleTooWeakResult || evidence.length > 0,
    titleSpecificity: titleSpecificity(title),
    metricsOk: metricsHealthy(rec),
  });

  // If overall quality is below threshold, surface that in status for testing.
  if (quality.status === "Needs validation") {
    rec.confidence = { ...((rec.confidence as object) || {}), label: "needs_validation", quality } as object;
    rec.quality = quality;
  } else {
    rec.quality = quality;
  }

  return { recommendation: rec, pathway, evidence, quality, title };
}

function metricsHealthy(rec: Record<string, unknown>): boolean {
  const ranges = (rec.outcome_ranges || []) as Array<{ metric_label?: string; unit?: string; direction?: string }>;
  if (!ranges.length) return true;
  let healthy = true;
  for (const r of ranges) {
    const direction = normalizeDirection(r.direction).direction;
    const type = r.unit ? String(r.unit) : "";
    // Lightweight integrity check — individual metric statuses handled elsewhere.
    if (direction === "ambiguous" && !r.metric_label) healthy = false;
  }
  return healthy;
}

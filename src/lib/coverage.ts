// Decision-coverage computation.
//
// "Decision coverage" is the number of high-quality implementations that exist
// for each operational problem — the KPI that matters more than raw record
// count. This module turns a feed of implementation records into a coverage
// report: headline rollups by tier, coverage by business function / industry /
// intervention / pathway, and a per-problem decision-coverage table with a
// promotion-style status (Gold Factory view).
//
// The engine exposes only aggregate metadata plus per-record endpoints, so this
// module is deliberately pure and deterministic: given a record feed it always
// produces the same report, which makes it testable and safe to run over a
// snapshot. The API route merges it with live engine headline numbers.

import { normalizeOrg, inferWorkflow } from "@/lib/reconcile";
import type { CanonicalPathway } from "@/data/pathway-taxonomy";

export type Tier = "gold" | "silver" | "bronze" | "rejected";

export interface CoverageRecord {
  record_id?: string;
  organization?: string;
  intervention?: string;
  intervention_category?: string;
  workflow?: string;
  industry?: string;
  business_function?: string;
  evidence_tier?: string;
  outcome_summary?: string;
  source_url?: string;
  quality_score?: number;
  pathway?: CanonicalPathway;
  published_at?: string;
}

export type CoverageStatus = "strong" | "moderate" | "thin" | "none";

export interface CoverageSlice {
  key: string;
  label: string;
  total: number;
  gold: number;
  silver: number;
  bronze: number;
  rejected: number;
  organizations: number;
  high_quality: number;
  high_quality_percent: number;
  average_quality: number;
  status: CoverageStatus;
}

export interface DecisionCoverageRow {
  workflow: string;
  label: string;
  business_function: string;
  interventions: number;
  implementations: number;
  high_quality: number;
  average_quality: number;
  status: CoverageStatus;
}

export interface CoverageReport {
  generated_at: string;
  source: string;
  headline: {
    implementations: number;
    organizations: number;
    industries: number;
    gold: number;
    silver: number;
    bronze: number;
    rejected: number;
    high_quality: number;
    high_quality_percent: number;
  };
  by_business_function: CoverageSlice[];
  by_industry: CoverageSlice[];
  by_intervention: CoverageSlice[];
  by_pathway: CoverageSlice[];
  decision_coverage: DecisionCoverageRow[];
  uncovered_workflows: string[];
}

const TIER_WEIGHT: Record<Tier, number> = { gold: 1, silver: 0.7, bronze: 0.4, rejected: 0 };

export function tierOf(record: CoverageRecord): Tier {
  const t = (record.evidence_tier || "").toLowerCase();
  if (t === "gold") return "gold";
  if (t === "silver") return "silver";
  if (t === "bronze") return "bronze";
  return "rejected";
}

// Business function inferred from workflow, mirroring reconcile.ts heuristics.
const WORKFLOW_FUNCTION: Record<string, string> = {
  invoice_processing: "Finance",
  process_automation: "Operations",
  ticketing: "Customer Support",
  contract_review: "Legal",
  onboarding: "HR",
  supply_chain: "Operations",
  ci_cd: "Engineering",
  lead_qualification: "Sales",
  marketing_automation: "Marketing",
  manufacturing: "Operations",
};

export function businessFunctionOf(record: CoverageRecord): string {
  const explicit = (record.business_function || "").trim();
  if (explicit) return explicit;
  const workflow = (record.workflow || "").trim().toLowerCase();
  if (!workflow || workflow === "unknown") return "Unknown";
  return WORKFLOW_FUNCTION[workflow] || "Other";
}

function averageQuality(records: CoverageRecord[]): number {
  if (!records.length) return 0;
  const sum = records.reduce((acc, r) => {
    if (typeof r.quality_score === "number") return acc + Math.min(1, Math.max(0, r.quality_score));
    return acc + TIER_WEIGHT[tierOf(r)];
  }, 0);
  return Math.round((sum / records.length) * 100) / 100;
}

function statusOf(highQuality: number, total: number): CoverageStatus {
  if (total === 0) return "none";
  if (highQuality >= 2) return "strong";
  if (highQuality >= 1) return "moderate";
  return "thin";
}

export function sliceCoverage(records: CoverageRecord[], keyFn: (r: CoverageRecord) => string): CoverageSlice[] {
  const groups = new Map<string, CoverageRecord[]>();
  for (const r of records) {
    const key = keyFn(r) || "Unknown";
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }
  return Array.from(groups.entries()).map(([key, items]) => {
    const counts = { gold: 0, silver: 0, bronze: 0, rejected: 0 };
    for (const r of items) counts[tierOf(r)]++;
    const orgs = new Set(items.map((r) => normalizeOrg(r.organization || "")).filter(Boolean)).size;
    const high_quality = counts.gold + counts.silver;
    const total = items.length;
    return {
      key,
      label: key,
      total,
      gold: counts.gold,
      silver: counts.silver,
      bronze: counts.bronze,
      rejected: counts.rejected,
      organizations: orgs,
      high_quality,
      high_quality_percent: total ? Math.round((high_quality / total) * 1000) / 10 : 0,
      average_quality: averageQuality(items),
      status: statusOf(high_quality, total),
    };
  }).sort((a, b) => b.high_quality - a.high_quality || b.total - a.total);
}

export function computeDecisionCoverage(records: CoverageRecord[]): DecisionCoverageRow[] {
  const groups = new Map<string, CoverageRecord[]>();
  for (const r of records) {
    const workflow = r.workflow || inferWorkflow(r.intervention || "", r.business_function || "") || "unknown";
    const list = groups.get(workflow);
    if (list) list.push(r);
    else groups.set(workflow, [r]);
  }
  return Array.from(groups.entries()).map(([workflow, items]) => {
    const interventions = new Set(items.map((r) => (r.intervention || "").trim()).filter(Boolean)).size;
    const high_quality = items.filter((r) => {
      const t = tierOf(r);
      return t === "gold" || t === "silver";
    }).length;
    return {
      workflow,
      label: workflow.replace(/_/g, " "),
      business_function: businessFunctionOf(items[0]),
      interventions,
      implementations: items.length,
      high_quality,
      average_quality: averageQuality(items),
      status: statusOf(high_quality, items.length),
    };
  }).sort((a, b) => b.implementations - a.implementations);
}

export function computeCoverageReport(records: CoverageRecord[], source = "record_feed"): CoverageReport {
  const tiers = { gold: 0, silver: 0, bronze: 0, rejected: 0 };
  for (const r of records) tiers[tierOf(r)]++;
  const high_quality = tiers.gold + tiers.silver;
  const total = records.length;

  return {
    generated_at: new Date().toISOString(),
    source,
    headline: {
      implementations: total,
      organizations: new Set(records.map((r) => normalizeOrg(r.organization || "")).filter(Boolean)).size,
      industries: new Set(records.map((r) => (r.industry || "").trim()).filter(Boolean)).size,
      gold: tiers.gold,
      silver: tiers.silver,
      bronze: tiers.bronze,
      rejected: tiers.rejected,
      high_quality,
      high_quality_percent: total ? Math.round((high_quality / total) * 1000) / 10 : 0,
    },
    by_business_function: sliceCoverage(records, businessFunctionOf),
    by_industry: sliceCoverage(records, (r) => r.industry || "Unknown"),
    by_intervention: sliceCoverage(records, (r) => (r.intervention || "").trim() || "Unknown"),
    by_pathway: sliceCoverage(records, (r) => r.pathway || r.intervention_category || "Unknown"),
    decision_coverage: computeDecisionCoverage(records),
    uncovered_workflows: [],
  };
}

export function uncoveredWorkflows(covered: CoverageReport, workflows: string[]): string[] {
  const present = new Set(covered.decision_coverage.map((d) => d.workflow));
  return workflows.filter((w) => !present.has(w));
}

export function headlineFromMetadata(meta: {
  published_records?: number;
  unique_organizations?: number;
  industries?: number;
  gold?: number;
  silver?: number;
  bronze?: number;
}): CoverageReport["headline"] {
  const gold = Number(meta.gold) || 0;
  const silver = Number(meta.silver) || 0;
  const bronze = Number(meta.bronze) || 0;
  const total = Number(meta.published_records) || 0;
  const high_quality = gold + silver;
  const rejected = Math.max(0, total - gold - silver - bronze);
  return {
    implementations: total,
    organizations: Number(meta.unique_organizations) || 0,
    industries: Number(meta.industries) || 0,
    gold,
    silver,
    bronze,
    rejected,
    high_quality,
    high_quality_percent: total ? Math.round((high_quality / total) * 1000) / 10 : 0,
  };
}

// -----------------------------------------------------------------------------
// Demand-driven discovery: coverage priority, Coverage Gain, Decision Confidence
// -----------------------------------------------------------------------------

export type CoveragePriority = "Critical" | "High" | "Medium" | "Low";

export const PRIORITY_ORDER: Record<CoveragePriority, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };

export function priorityFor(status: CoverageStatus, gold: number, silver: number): CoveragePriority {
  if (status === "none") return "Critical";
  if (status === "thin") return "High";
  if (status === "moderate" && gold === 0) return "High";
  if (status === "moderate") return "Medium";
  return "Low";
}

export interface WorkflowPriority {
  workflow: string;
  label: string;
  business_function: string;
  coverage_status: CoverageStatus;
  gold: number;
  silver: number;
  implementations: number;
  high_quality: number;
  evidence_freshness: number; // 0..1 share of records published in last 365 days
  recommendation_quality: number; // 0..1
  confidence: number; // 0..1 decision confidence
  priority: CoveragePriority;
}

const FRESHNESS_DAYS = 365;

function evidenceFreshness(records: CoverageRecord[]): number {
  if (!records.length) return 0;
  const cutoff = Date.now() - FRESHNESS_DAYS * 24 * 60 * 60 * 1000;
  const fresh = records.filter((r) => {
    const ts = typeof r.published_at === "string" ? Date.parse(r.published_at) : NaN;
    return Number.isFinite(ts) && ts >= cutoff;
  }).length;
  return Math.round((fresh / records.length) * 100) / 100;
}

function outcomeQuality(records: CoverageRecord[]): number {
  if (!records.length) return 0;
  const measured = records.filter((r) => /%|\$|\d|reduc|improv|sav|faster/i.test(r.outcome_summary || "")).length;
  return Math.round((measured / records.length) * 100) / 100;
}

function implementationDiversity(records: CoverageRecord[]): number {
  if (!records.length) return 0;
  const orgCount = new Set(records.map((r) => normalizeOrg(r.organization || "")).filter(Boolean)).size;
  return Math.min(1, orgCount / 3);
}

export interface DecisionConfidenceInputs {
  coverage: number; // 0..1 fraction of high-quality implementations in this workflow
  evidence_quality: number; // 0..1 average tier/quality
  diversity: number; // 0..1 distinct organizations (avoids single-source)
  freshness: number; // 0..1 share recent
  outcome_quality: number; // 0..1 share with measured outcome
}

export function decisionConfidence(inputs: DecisionConfidenceInputs): number {
  return Math.round(
    (0.3 * inputs.coverage
      + 0.25 * inputs.evidence_quality
      + 0.2 * inputs.diversity
      + 0.15 * inputs.freshness
      + 0.1 * inputs.outcome_quality) * 1000
  ) / 1000;
}

export function workflowPriority(records: CoverageRecord[], workflow?: string): WorkflowPriority {
  const wf = workflow || (records[0]?.workflow as string) || "unknown";
  const grouped = computeDecisionCoverage(records);
  const row = grouped.find((g) => g.workflow === wf) || {
    workflow: wf,
    label: wf.replace(/_/g, " "),
    business_function: businessFunctionOf(records[0] || ({} as CoverageRecord)),
    interventions: 0,
    implementations: 0,
    high_quality: 0,
    average_quality: 0,
    status: "none" as CoverageStatus,
  };
  const gold = records.filter((r) => tierOf(r) === "gold").length;
  const silver = records.filter((r) => tierOf(r) === "silver").length;
  const coverage = row.implementations ? row.high_quality / row.implementations : 0;
  const confidence = decisionConfidence({
    coverage,
    evidence_quality: row.average_quality,
    diversity: implementationDiversity(records),
    freshness: evidenceFreshness(records),
    outcome_quality: outcomeQuality(records),
  });
  return {
    workflow: wf,
    label: row.label,
    business_function: row.business_function,
    coverage_status: row.status,
    gold,
    silver,
    implementations: row.implementations,
    high_quality: row.high_quality,
    evidence_freshness: evidenceFreshness(records),
    recommendation_quality: row.average_quality,
    confidence,
    priority: priorityFor(row.status, gold, silver),
  };
}

export function priorityPlan(records: CoverageRecord[]): WorkflowPriority[] {
  const groups = new Map<string, CoverageRecord[]>();
  for (const r of records) {
    const wf = r.workflow || "unknown";
    const list = groups.get(wf);
    if (list) list.push(r);
    else groups.set(wf, [r]);
  }
  return Array.from(groups.entries())
    .map(([wf, recs]) => workflowPriority(recs, wf))
    .sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority] || b.high_quality - a.high_quality);
}

export interface CoverageGain {
  workflow: string;
  previous_status: CoverageStatus;
  new_status: CoverageStatus;
  previous_high_quality: number;
  new_high_quality: number;
  previously_covered: boolean;
  now_covered: boolean;
  coverage_gain: number; // 0..1 fractional improvement in decision coverage
  promoted_records: number;
}

/**
 * Coverage Gain: how much a set of promoted records improves Compass's ability
 * to make recommendations for a workflow. The optimization target is measured
 * in decision coverage, not raw record count.
 */
export function coverageGain(
  existing: CoverageRecord[],
  promoted: CoverageRecord[],
  workflow?: string,
): CoverageGain {
  const wf = workflow || promoted[0]?.workflow || "unknown";
  const previous = workflowPriority(existing, wf);
  const combined = [...existing, ...promoted];
  const latest = workflowPriority(combined, wf);
  return {
    workflow: wf,
    previous_status: previous.coverage_status,
    new_status: latest.coverage_status,
    previous_high_quality: previous.high_quality,
    new_high_quality: latest.high_quality,
    previously_covered: previous.coverage_status !== "none",
    now_covered: latest.coverage_status !== "none",
    coverage_gain: latest.confidence - previous.confidence,
    promoted_records: promoted.length,
  };
}

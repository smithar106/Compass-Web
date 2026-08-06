import { NextRequest, NextResponse } from "next/server";
import { compassApiBase } from "@/lib/engine-proxy";
import {
  computeCoverageReport,
  headlineFromMetadata,
  priorityPlan,
  coverageGain,
  uncoveredWorkflows,
  type CoverageRecord,
  type CoverageGain,
} from "@/lib/coverage";

export const dynamic = "force-dynamic";

async function fetchEngineMetadata(): Promise<Record<string, unknown> | null> {
  const base = compassApiBase();
  if (!base) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${base}/api/metadata`, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * GET /api/coverage — live Implementation Intelligence headline from the
 * engine's evidence library metadata (implementations, tiers, organizations,
 * industries). Dimension-level coverage requires a record feed (POST) because
 * the engine has no public record-list endpoint.
 */
export async function GET() {
  const meta = await fetchEngineMetadata();
  const headline = headlineFromMetadata(meta || {});
  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      source: "engine_metadata",
      headline,
      detail: null,
      note: "Dimension-level decision coverage requires a record feed (POST /api/coverage with { records }).",
    },
    {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600" },
    }
  );
}

/**
 * POST /api/coverage — compute a full decision-coverage report from a feed of
 * implementation records. Body: { records: CoverageRecord[], workflows?: string[] }.
 * Used by the evaluation harness and any pipeline that has record-level access.
 */
export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const records: CoverageRecord[] = Array.isArray(body.records) ? body.records : [];
  if (!records.length) {
    return NextResponse.json({ error: "records must be a non-empty array" }, { status: 400 });
  }

  const report = computeCoverageReport(records, "record_feed");
  if (Array.isArray(body.workflows) && body.workflows.length) {
    report.uncovered_workflows = uncoveredWorkflows(report, body.workflows as string[]);
  }

  // Demand-driven discovery: where to crawl next + how much a promotion helps.
  const priorities = priorityPlan(records);

  // Coverage Gain: simulate promoting every gold+silver record that is currently
  // bronze/rejected in each workflow, and report the decision-coverage delta.
  const existing = records.filter((r) => {
    const t = (r.evidence_tier || "").toLowerCase();
    return t === "gold" || t === "silver";
  });
  const candidates = records.filter((r) => {
    const t = (r.evidence_tier || "").toLowerCase();
    return t !== "gold" && t !== "silver";
  });
  const gainsByWorkflow = new Map<string, CoverageGain>();
  for (const wf of new Set(records.map((r) => r.workflow || "unknown"))) {
    const wfExisting = existing.filter((r) => (r.workflow || "unknown") === wf);
    const wfCandidates = candidates.filter((r) => (r.workflow || "unknown") === wf);
    if (wfCandidates.length) {
      gainsByWorkflow.set(wf, coverageGain(wfExisting, wfCandidates, wf));
    }
  }
  const gains = Array.from(gainsByWorkflow.values())
    .sort((a, b) => b.coverage_gain - a.coverage_gain);

  return NextResponse.json(
    { ...report, priority_plan: priorities, coverage_gain: gains },
    {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600" },
    }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { compassApiBase } from "@/lib/engine-proxy";
import {
  computeCoverageReport,
  headlineFromMetadata,
  type CoverageRecord,
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
    const { uncoveredWorkflows } = await import("@/lib/coverage");
    report.uncovered_workflows = uncoveredWorkflows(report, body.workflows as string[]);
  }

  return NextResponse.json(report, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600" },
  });
}

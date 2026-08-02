import { NextRequest, NextResponse } from "next/server";
import {
  normalizeProblem,
  selectFollowUps,
  buildProfileFromAnalyze,
  inferAnswersFromText,
} from "@/lib/analyze";

function getCompassApiUrl(): string | null {
  return (
    process.env.COMPASS_API_URL ??
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null)
  );
}

/**
 * Thin-client proxy to the engine's server-side analysis sessions.
 * Returns null when the engine flow is unavailable so callers can fall back.
 */
async function proxyToEngine(
  path: string,
  body?: unknown,
  timeoutMs = 30000
): Promise<Response | null> {
  const base = getCompassApiUrl();
  if (!base) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${base}${path}`, {
      method: body !== undefined ? "POST" : "GET",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  const action: string = body.action || "create";
  const analysisId: string | undefined = body.analysis_id;

  // 1) Engine-owned orchestration (the platform path).
  if (action === "confirm" && analysisId) {
    const res = await proxyToEngine(`/api/analyze/${encodeURIComponent(analysisId)}/confirm`, {
      edits: body.edits || {},
      organization: body.organization || undefined,
    });
    if (res && res.ok) return res;
  } else if (action === "answers" && analysisId) {
    const res = await proxyToEngine(`/api/analyze/${encodeURIComponent(analysisId)}/answers`, { answers: body.answers || {} });
    if (res && res.ok) return res;
  } else if (action === "create") {
    const res = await proxyToEngine("/api/analyze", {
      problem_text: String(body.problem_text || ""),
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      organization_name: String(body.organization_name || ""),
      organization_domain: String(body.organization_domain || ""),
      organization_industry: String(body.organization_industry || ""),
    });
    if (res && res.ok) return res;
  }

  // 2) Compatibility fallback: web-orchestrated flow (kept until parity passes).
  return localAnalyze(body);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || searchParams.get("analysis_id");
  if (id) {
    const res = await proxyToEngine(`/api/analyze/${encodeURIComponent(id)}`, undefined, 15000);
    if (res && res.ok) return res;
  }
  return NextResponse.json({ error: "Analysis session not found" }, { status: 404 });
}

async function localAnalyze(body: any): Promise<NextResponse> {
  const problemText: string = String(body.problem_text || "").trim();
  if (!problemText) {
    return NextResponse.json({ error: "problem_text is required" }, { status: 400 });
  }
  const compassApiUrl = getCompassApiUrl();
  if (!compassApiUrl) {
    return NextResponse.json({ error: "Compass Engine URL is not configured.", type: "config_error" }, { status: 500 });
  }

  const base = normalizeProblem(problemText + " " + (Array.isArray(body.attachments) ? body.attachments.join(" ") : ""));
  const edits = body.edits && typeof body.edits === "object" ? body.edits : {};
  const normalization = {
    workflow: edits.workflow || base.workflow,
    businessFunction: edits.businessFunction || base.businessFunction,
    problemStatement: edits.problemStatement || base.problemStatement,
    rootCauseHypothesis: edits.rootCauseHypothesis || base.rootCauseHypothesis,
    desiredOutcome: edits.desiredOutcome || base.desiredOutcome,
    decision: base.decision,
  };
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};

  let engineResult: any = null;
  try {
    const profile = buildProfileFromAnalyze(normalization, answers);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${compassApiUrl}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      return NextResponse.json({ error: `Engine returned an error (${res.status}).`, type: "engine_error" }, { status: 502 });
    }
    engineResult = await res.json();
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      { error: aborted ? "Engine did not respond in time." : "Engine unreachable.", type: "engine_unreachable" },
      { status: aborted ? 504 : 502 }
    );
  }

  const top = engineResult?.recommendations?.[0] || null;
  const engineGaps = top?.information_gaps || engineResult?.information_gaps || [];
  const questions = selectFollowUps({ text: problemText, answers, engineGaps, max: 5 });

  const label = top?.confidence?.label;
  const tier = top?.evidence_summary?.overall_tier;
  const comparables = top?.evidence_summary?.total_comparables || 0;
  const status =
    label === "insufficient" || tier === "insufficient" || comparables === 0
      ? "insufficient_evidence"
      : questions.length === 0
        ? "decision_ready"
        : "preliminary_result";

  return NextResponse.json(
    {
      analysis_id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      normalization,
      questions,
      decision: engineResult,
      status,
      inferred: Array.from(inferAnswersFromText(problemText)),
    },
    { status: 200 }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { structuredProblem } from "@/lib/prototype/problem-definitions";
import { mapEngineToDecision } from "@/lib/prototype/engine-mapper";
import type { EngineResponse } from "@/lib/prototype/engine-mapper";
import { compassApiBase } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

/**
 * POST /api/prototype/decision
 *
 * Resolves a prototype problem against the live engine and returns a
 * PrototypeDecision-compatible payload (board-presentation schema, no
 * tool-mechanics). Thin problems return an honest "needs_more_evidence"
 * decision with no fabricated comparables.
 *
 * Body: { problemId, answers?: {questionId, value}[] }
 */
export async function POST(request: NextRequest) {
  let body: { problemId?: string; answers?: { questionId: string; value: string }[] } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const problemId = body.problemId;
  const problem = structuredProblem(problemId || "");
  if (!problem) {
    return NextResponse.json({ error: `Unknown problem: ${problemId}` }, { status: 404 });
  }

  const base = compassApiBase();
  if (!base) {
    return NextResponse.json(
      { error: "Engine not configured.", decision: null, source: "unavailable" },
      { status: 200 }
    );
  }

  // Map context answers (org size) into the engine query when provided.
  const orgSize = (body.answers ?? []).find((a) => a.questionId === "org-size")?.value || "";
  const companySize = orgSize
    ? {
        "Under 50 people": "small",
        "50–500": "medium",
        "500–2,000": "large",
        "2,000+": "enterprise",
      }[orgSize]
    : "";

  const payload = {
    business_function: problem.businessFunction,
    workflow: problem.workflow,
    problem_statement: problem.problemStatement,
    desired_outcome: problem.desiredOutcome,
    company_size: companySize,
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${base}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Engine returned ${res.status}`, decision: null, source: "error" },
        { status: 200 }
      );
    }
    const engineData = (await res.json()) as EngineResponse;
    const decision = mapEngineToDecision(problem, engineData);
    return NextResponse.json({ decision, source: "live" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Engine unreachable.", decision: null, source: "unavailable" },
      { status: 200 }
    );
  }
}

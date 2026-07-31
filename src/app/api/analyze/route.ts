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

function generateId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 15);
}

export async function POST(request: NextRequest) {
  const analysisId = generateId();
  try {
    const body = await request.json();
    const problemText: string = String(body.problem_text || "").trim();
    if (!problemText) {
      return NextResponse.json({ error: "problem_text is required" }, { status: 400 });
    }

    const compassApiUrl = getCompassApiUrl();
    if (!compassApiUrl) {
      return NextResponse.json(
        { error: "Compass Engine URL is not configured.", type: "config_error" },
        { status: 500 }
      );
    }

    // Step 1: deterministic normalization, overridable by the confirm step edits.
    const base = normalizeProblem(problemText);
    const edits = (body.edits && typeof body.edits === "object" ? body.edits : {}) as Record<string, string>;
    const normalization = {
      workflow: edits.workflow || base.workflow,
      businessFunction: edits.businessFunction || base.businessFunction,
      problemStatement: edits.problemStatement || base.problemStatement,
      rootCauseHypothesis: edits.rootCauseHypothesis || base.rootCauseHypothesis,
      desiredOutcome: edits.desiredOutcome || base.desiredOutcome,
      decision: base.decision,
    };

    const answers = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, string>;

    // Step 2: query the live evidence graph via the production engine.
    const profile = buildProfileFromAnalyze(normalization, answers);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    let engineResult: any = null;
    try {
      const engineRes = await fetch(`${compassApiUrl}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        signal: controller.signal,
      });
      if (engineRes.ok) {
        engineResult = await engineRes.json();
      } else {
        const text = await engineRes.text().catch(() => "");
        return NextResponse.json(
          { error: `Engine returned an error (${engineRes.status}).`, type: "engine_error", detail: text.slice(0, 300) },
          { status: 502 }
        );
      }
    } catch (e) {
      const aborted = e instanceof Error && e.name === "AbortError";
      return NextResponse.json(
        { error: aborted ? "Engine did not respond in time." : "Engine unreachable.", type: "engine_unreachable" },
        { status: aborted ? 504 : 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    // Step 3: deterministic targeted follow-ups from the engine's gaps + missing fields.
    const top = engineResult?.recommendations?.[0] || null;
    const engineGaps: { title: string }[] = top?.information_gaps || engineResult?.information_gaps || [];
    const questions = selectFollowUps({ text: problemText, answers, engineGaps, max: 5 });

    // Status: decision ready only if evidence supports it; otherwise preliminary or deferred.
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
        analysis_id: analysisId,
        normalization,
        questions,
        decision: engineResult,
        status,
        inferred: Array.from(inferAnswersFromText(problemText)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Analyze] Error:", error);
    return NextResponse.json({ error: "Analyze failed", type: "server_error" }, { status: 500 });
  }
}

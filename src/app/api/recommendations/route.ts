import { NextRequest, NextResponse } from "next/server";
import { generateDevFallback, getDevRecommendation, isDevRec } from "@/lib/dev-fallback";

const compassApiUrl =
  process.env.COMPASS_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 8);
  try {
    const body = await request.json();
    console.log(`[Recs:${requestId}] POST received`, { profileKeys: Object.keys(body) });

    if (!compassApiUrl) {
      console.error(`[Recs:${requestId}] COMPASS_API_URL not configured`);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Recs:${requestId}] Dev fallback — generating mock recommendation`);
        return NextResponse.json(generateDevFallback(body), { status: 200 });
      }
      return NextResponse.json({ error: "Compass Engine URL is not configured.", type: "config_error" }, { status: 500 });
    }

    const payload = {
      business_function: body.business_function || "",
      workflow: body.workflow || "",
      problem_statement: body.problem_statement || "",
      constraint: body.constraint || "",
      industry: body.industry || "",
      company_size: body.company_size || "",
      workflow_frequency: body.workflow_frequency || "",
      people_involved: body.people_involved || "",
      handoffs: body.handoffs || "",
      current_tools: body.current_tools || [],
      exception_rate: body.exception_rate || "",
      budget_range: body.budget_range || "",
      implementation_timeline: body.implementation_timeline || "",
      business_risk: body.business_risk || "",
      process_stability: body.process_stability || "",
      previous_attempts: body.previous_attempts || "",
      desired_outcome: body.desired_outcome || "",
      annual_workflow_volume: body.annual_workflow_volume || "",
      current_handling_time: body.current_handling_time || "",
      loaded_labor_cost: body.loaded_labor_cost || "",
      standardization_level: body.standardization_level || "",
      failure_impact: body.failure_impact || "",
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    let engineRes: Response;
    try {
      engineRes = await fetch(`${compassApiUrl}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error(`[Recs:${requestId}] Engine unreachable:`, fetchError);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Recs:${requestId}] Dev fallback — engine unreachable, generating mock`);
        return NextResponse.json(generateDevFallback(body), { status: 200 });
      }
      return NextResponse.json({ error: "Recommendation engine is unreachable.", type: "engine_unreachable" }, { status: 504 });
    }
    clearTimeout(timeout);

    if (!engineRes.ok) {
      const errText = await engineRes.text().catch(() => "");
      console.error(`[Recs:${requestId}] Engine error (${engineRes.status}): ${errText.slice(0, 500)}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Recs:${requestId}] Dev fallback — engine returned ${engineRes.status}, generating mock`);
        return NextResponse.json(generateDevFallback(body), { status: 200 });
      }
      return NextResponse.json({ error: "Engine returned an error.", type: "engine_error" }, { status: 502 });
    }

    const engineResult = await engineRes.json();

    if (!engineResult.recommendations || !Array.isArray(engineResult.recommendations)) {
      console.error(`[Recs:${requestId}] Malformed engine response — missing recommendations array`);
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(generateDevFallback(body), { status: 200 });
      }
      return NextResponse.json({ error: "Malformed response from engine.", type: "malformed_response" }, { status: 502 });
    }

    if (!engineResult.recommendation_id) {
      console.error(`[Recs:${requestId}] Engine response missing recommendation_id`);
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(generateDevFallback(body), { status: 200 });
      }
      return NextResponse.json({ error: "Malformed response from engine.", type: "malformed_response" }, { status: 502 });
    }

    return NextResponse.json(engineResult, { status: 200 });
  } catch (error) {
    console.error(`[Recs] Error:`, error);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Engine did not respond within 30 seconds.", type: "engine_unreachable" }, { status: 504 });
    }
    return NextResponse.json({ error: "Recommendation failed", type: "server_error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 8);
  const maxRetries = 2;
  let lastError: string | null = null;

  const { searchParams } = new URL(request.url);
  const recId = searchParams.get("recommendation_id") || searchParams.get("run_id");
  if (!recId) {
    return NextResponse.json({ error: "recommendation_id is required" }, { status: 400 });
  }

  if (isDevRec(recId)) {
    const dev = getDevRecommendation(recId);
    if (dev) return NextResponse.json(dev, { status: 200 });
    return NextResponse.json({ error: "Decision not found." }, { status: 404 });
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {

      if (!compassApiUrl) {
        return NextResponse.json({ error: "Compass Engine URL is not configured." }, { status: 500 });
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const engineRes = await fetch(`${compassApiUrl}/api/recommendations/${encodeURIComponent(recId)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (engineRes.status === 404) {
        return NextResponse.json({ error: "Decision not found." }, { status: 404 });
      }

      if (!engineRes.ok) {
        const errText = await engineRes.text().catch(() => "");
        console.error(`[Recs:${requestId}] GET engine error (${engineRes.status}): ${errText.slice(0, 500)}`);
        if (attempt < maxRetries) {
          lastError = "Engine temporarily unavailable";
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        return NextResponse.json({ error: "Engine temporarily unavailable" }, { status: 502 });
      }

      const data = await engineRes.json();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        lastError = "Engine did not respond within 15 seconds.";
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        return NextResponse.json({ error: lastError }, { status: 504 });
      }
      lastError = error instanceof Error ? error.message : "Failed to load recommendations";
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      return NextResponse.json({ error: lastError }, { status: 500 });
    }
  }

  return NextResponse.json({ error: lastError || "Failed to load recommendations" }, { status: 500 });
}

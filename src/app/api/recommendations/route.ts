import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({ error: "Compass Engine URL is not configured.", type: "config_error" }, { status: 500 });
    }

    const payload = {
      business_function: body.business_function || "",
      workflow: body.workflow || "",
      problem_statement: body.problem_statement || "",
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
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const engineRes = await fetch(`${compassApiUrl}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!engineRes.ok) {
      const errText = await engineRes.text();
      return NextResponse.json({ error: `Engine error: ${errText.slice(0, 200)}`, type: "engine_error" }, { status: 502 });
    }

    const engineResult = await engineRes.json();

    if (!engineResult.recommendations || !Array.isArray(engineResult.recommendations)) {
      return NextResponse.json({ error: "Malformed response from engine.", type: "malformed_response" }, { status: 502 });
    }

    return NextResponse.json(engineResult, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recommendation failed";
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Engine did not respond within 30 seconds.", type: "engine_unreachable" }, { status: 504 });
    }
    return NextResponse.json({ error: message, type: "server_error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get("run_id");
    if (!runId) {
      return NextResponse.json({ error: "run_id is required" }, { status: 400 });
    }
    const { createAdminClient } = await import("@/lib/supabase-admin");
    const supabase = createAdminClient();
    const { data: run } = await supabase
      .from("recommendation_runs" as any)
      .select("*, recommendation_options(*, recommendation_evidence_links(*))")
      .eq("recommendation_run_id", runId)
      .single();
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }
    const options = (run as any).recommendation_options || [];
    const recommendations = options
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((opt: any) => formatRecommendation(opt));
    return NextResponse.json({
      recommendation_id: runId,
      status: "complete",
      recommendations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load recommendations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function formatRecommendation(opt: any) {
  const evidenceLinks = opt.recommendation_evidence_links || [];
  const comparables = evidenceLinks
    .filter((e: any) => !e.is_negative)
    .map((e: any) => ({
      record_id: e.id || "",
      organization: e.organization,
      intervention: e.intervention,
      outcome_summary: e.outcome || "",
      evidence_tier: e.evidence_tier || "bronze",
      similarity_score: e.similarity_score || 0,
      source_title: e.source_title || "",
      source_url: e.source_url || "",
      relevance_explanation: "",
    }));
  const negativeEvidence = evidenceLinks
    .filter((e: any) => e.is_negative)
    .map((e: any) => ({
      organization: e.organization,
      intervention: e.intervention,
      failure_reasons: e.failure_reasons || [],
      lessons: [],
    }));
  return {
    rank: opt.rank,
    is_compass_choice: opt.is_compass_choice,
    intervention_id: opt.intervention_id || opt.intervention_category || "",
    category: opt.intervention_category || "",
    title: opt.title || "",
    subtitle: opt.subtitle || "",
    description: opt.summary || opt.description || "",
    selection_status: opt.selection_status || "recommended",
    rationale: opt.rationale || "",
    why_it_ranked_here: opt.why_it_ranked || opt.why_it_ranked_here || [],
    assumptions: opt.assumptions || [],
    confidence: {
      score: opt.confidence_score ?? opt.confidence?.score ?? 0,
      label: opt.confidence_label ?? opt.confidence?.label ?? "insufficient",
      explanation: opt.confidence_explanation ?? opt.confidence?.explanation ?? "",
    },
    impact: opt.impact || {
      annual_savings: { status: "insufficient_input", low: null, expected: null, high: null, currency: "USD", basis: "", confidence: "low" },
      annual_hours_returned: { status: "insufficient_input", low: null, expected: null, high: null, period: "annual", basis: "", confidence: "low" },
      implementation_timeline: { min_weeks: null, expected_weeks: null, max_weeks: null, basis: "" },
      project_team: { min_people: 0, expected_people: 0, max_people: 0, roles: [], basis: "" },
    },
    evidence_summary: {
      overall_tier: opt.evidence_overall_tier || opt.evidence_summary?.overall_tier || "bronze",
      total_comparables: opt.evidence_total_comparables || opt.evidence_summary?.total_comparables || 0,
      gold_count: opt.evidence_gold_count || opt.evidence_summary?.gold_count || 0,
      silver_count: opt.evidence_silver_count || opt.evidence_summary?.silver_count || 0,
      bronze_count: opt.evidence_bronze_count || opt.evidence_summary?.bronze_count || 0,
      average_evidence_score: opt.evidence_average_score || opt.evidence_summary?.average_evidence_score || 0,
    },
    comparable_implementations: comparables,
    risks: opt.risks || [],
    alternatives_considered: opt.alternatives_considered || [],
  };
}

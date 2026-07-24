import { NextRequest, NextResponse } from "next/server";

const COMPASS_API_URL = process.env.COMPASS_API_URL || "http://127.0.0.1:8001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, ...profile } = body;

    const { createAdminClient } = await import("@/lib/supabase-admin");
    const supabase = createAdminClient();

    const investigationId = body.investigation_id;

    const pythonResponse = await fetch(`${COMPASS_API_URL}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        investigation_id: investigationId,
        business_function: profile.business_function || "",
        workflow: profile.workflow || "",
        problem_statement: profile.problem_statement || "",
        industry: profile.industry || "",
        company_size: profile.company_size || "",
        workflow_frequency: profile.workflow_frequency || "",
        people_involved: profile.people_involved || "",
        handoffs: profile.handoffs || "",
        current_tools: profile.current_tools || [],
        exception_rate: profile.exception_rate || "",
        budget_range: profile.budget_range || "",
        implementation_timeline: profile.implementation_timeline || "",
        business_risk: profile.business_risk || "",
        process_stability: profile.process_stability || "",
        previous_attempts: profile.previous_attempts || "",
        desired_outcome: profile.desired_outcome || "",
      }),
    });

    if (!pythonResponse.ok) {
      const errText = await pythonResponse.text();
      throw new Error(`Recommendation engine error (${pythonResponse.status}): ${errText}`);
    }

    const engineResult = await pythonResponse.json();

    await persistToSupabase(supabase, sessionId, engineResult);

    return NextResponse.json(engineResult, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recommendation failed";
    console.error("Recommendation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
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
      recommendation_run_id: runId,
      problem_profile: (run as any).problem_profile || {},
      recommendations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load recommendations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function persistToSupabase(supabase: any, sessionId: string | undefined, result: any) {
  try {
    const profile = result.problem_profile || {};

    let investigationId: string | undefined;

    if (sessionId) {
      const { data: inv } = await supabase
        .from("investigations" as any)
        .insert({ session_id: sessionId, status: "completed" })
        .select("id")
        .single();

      if (inv) {
        investigationId = (inv as any).id;

        await supabase.from("investigation_profiles" as any).insert({
          investigation_id: investigationId,
          ...profile,
          current_tools: profile.current_tools || [],
        });
      }
    }

    const { data: run } = await supabase
      .from("recommendation_runs" as any)
      .insert({
        investigation_id: investigationId || null,
        recommendation_run_id: result.recommendation_run_id,
        engine_version: profile.engine_version || "compass-recommendation-v2",
        dataset_version: profile.dataset_version || "v1",
        total_comparables_found: 0,
        overall_confidence_score: result.recommendations?.[0]?.confidence?.score || 0,
      })
      .select("id")
      .single();

    if (!run) return;
    const runDbId = (run as any).id;

    for (const rec of result.recommendations || []) {
      const { data: opt } = await supabase
        .from("recommendation_options" as any)
        .insert({
          recommendation_run_id: runDbId,
          rank: rec.rank,
          is_compass_choice: rec.is_compass_choice,
          title: rec.title,
          summary: rec.summary,
          intervention_category: rec.intervention_category,
          fit_score: rec.fit_score,
          confidence_score: rec.confidence?.score || 0,
          confidence_label: rec.confidence?.label || "limited",
          confidence_explanation: rec.confidence?.explanation || "",
          evidence_overall_tier: rec.evidence_summary?.overall_tier || "bronze",
          evidence_total_comparables: rec.evidence_summary?.total_comparables || 0,
          evidence_gold_count: rec.evidence_summary?.gold_count || 0,
          evidence_silver_count: rec.evidence_summary?.silver_count || 0,
          evidence_bronze_count: rec.evidence_summary?.bronze_count || 0,
          evidence_failed_count: rec.evidence_summary?.failed_comparables || 0,
          evidence_average_score: rec.evidence_summary?.average_evidence_score || 0,
          impact_label: rec.projected_impact?.label || "",
          impact_low: rec.projected_impact?.low ?? null,
          impact_high: rec.projected_impact?.high ?? null,
          impact_unit: rec.projected_impact?.unit || "",
          impact_methodology: rec.projected_impact?.methodology || "",
          impact_sufficient: rec.projected_impact?.is_sufficiently_supported || false,
          timeline_low_weeks: rec.timeline?.low_weeks ?? null,
          timeline_high_weeks: rec.timeline?.high_weeks ?? null,
          why_it_ranked: rec.why_it_ranked || [],
          alternatives_considered: rec.alternatives_considered || [],
          assumptions: rec.assumptions || [],
          risks: rec.risks || [],
        })
        .select("id")
        .single();

      if (!opt) continue;
      const optId = (opt as any).id;

      for (const comp of rec.comparables || []) {
        await supabase.from("recommendation_evidence_links" as any).insert({
          recommendation_option_id: optId,
          organization: comp.organization,
          industry: comp.industry,
          workflow: comp.workflow,
          intervention: comp.intervention,
          outcome: comp.outcome,
          status: comp.status,
          similarity_score: comp.similarity_score,
          evidence_score: comp.evidence_score,
          evidence_tier: comp.evidence_tier,
          supporting_passage: comp.supporting_passage,
          source_title: comp.source_title,
          source_url: comp.source_url,
          is_negative: false,
        });
      }

      for (const neg of rec.negative_evidence || []) {
        await supabase.from("recommendation_evidence_links" as any).insert({
          recommendation_option_id: optId,
          organization: neg.organization,
          intervention: neg.intervention,
          outcome: (neg.failure_reasons || []).join("; "),
          status: "failed",
          evidence_tier: "bronze",
          supporting_passage: (neg.failure_reasons || []).join("; "),
          is_negative: true,
          failure_reasons: neg.failure_reasons || [],
        });
      }
    }
  } catch (err) {
    console.error("Failed to persist to Supabase:", err);
  }
}

function formatRecommendation(opt: any) {
  const evidenceLinks = opt.recommendation_evidence_links || [];
  const comparables = evidenceLinks
    .filter((e: any) => !e.is_negative)
    .map((e: any) => ({
      organization: e.organization,
      industry: e.industry,
      workflow: e.workflow,
      intervention: e.intervention,
      outcome: e.outcome,
      status: e.status,
      similarity_score: e.similarity_score,
      evidence_score: e.evidence_score,
      evidence_tier: e.evidence_tier,
      supporting_passage: e.supporting_passage,
      source_title: e.source_title,
      source_url: e.source_url,
    }));

  const negativeEvidence = evidenceLinks
    .filter((e: any) => e.is_negative)
    .map((e: any) => ({
      organization: e.organization,
      intervention: e.intervention,
      failure_reasons: e.failure_reasons || [],
      similarity_score: e.similarity_score,
    }));

  return {
    rank: opt.rank,
    is_compass_choice: opt.is_compass_choice,
    title: opt.title,
    summary: opt.summary,
    intervention_category: opt.intervention_category,
    fit_score: opt.fit_score,
    confidence: {
      score: opt.confidence_score,
      label: opt.confidence_label,
      explanation: opt.confidence_explanation,
    },
    evidence_summary: {
      overall_tier: opt.evidence_overall_tier,
      total_comparables: opt.evidence_total_comparables,
      gold_count: opt.evidence_gold_count,
      silver_count: opt.evidence_silver_count,
      bronze_count: opt.evidence_bronze_count,
      failed_comparables: opt.evidence_failed_count,
      average_evidence_score: opt.evidence_average_score,
    },
    projected_impact: {
      label: opt.impact_label,
      low: opt.impact_low,
      high: opt.impact_high,
      unit: opt.impact_unit,
      methodology: opt.impact_methodology,
      is_sufficiently_supported: opt.impact_sufficient,
    },
    timeline: {
      low_weeks: opt.timeline_low_weeks,
      high_weeks: opt.timeline_high_weeks,
    },
    why_it_ranked: opt.why_it_ranked || [],
    comparables,
    negative_evidence: negativeEvidence,
    alternatives_considered: opt.alternatives_considered || [],
    assumptions: opt.assumptions || [],
    risks: opt.risks || [],
  };
}

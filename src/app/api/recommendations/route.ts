import { NextRequest, NextResponse } from "next/server";

const COMPASS_API_URL = process.env.COMPASS_API_URL || "http://127.0.0.1:8001";

function getSupabaseAdmin() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) return null;
    const { createClient } = require("@supabase/supabase-js");
    return createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch (e) {
    console.warn("[Recs] Supabase admin not available:", e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 8);
  try {
    const body = await request.json();
    const { sessionId, ...profile } = body;
    console.log(`[Recs:${requestId}] POST received`, { sessionId: sessionId?.slice(0, 8), profileKeys: Object.keys(profile) });

    const payload = {
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
    };

    console.log(`[Recs:${requestId}] Calling Compass engine at ${COMPASS_API_URL}`);
    let engineResult: any;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const pythonResponse = await fetch(`${COMPASS_API_URL}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!pythonResponse.ok) {
        const errText = await pythonResponse.text();
        throw new Error(`Engine error (${pythonResponse.status}): ${errText}`);
      }

      engineResult = await pythonResponse.json();
      console.log(`[Recs:${requestId}] Engine OK, ${engineResult.recommendations?.length} recs`);
    } catch (engineErr) {
      const msg = engineErr instanceof Error ? engineErr.message : String(engineErr);
      console.error(`[Recs:${requestId}] Engine call failed:`, msg);
      engineResult = generateDemoResponse(payload);
      console.log(`[Recs:${requestId}] Using demo fallback`);
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await persistToSupabase(supabase, sessionId, engineResult).catch((e: any) =>
        console.warn(`[Recs:${requestId}] Persist failed (non-fatal):`, e)
      );
    }

    return NextResponse.json(engineResult, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recommendation failed";
    console.error(`[Recs:${requestId}] Fatal error:`, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateDemoResponse(profile: any) {
  const workflow = profile.workflow || "process_automation";
  const dept = profile.business_function || "operations";
  return {
    recommendation_run_id: `demo_${Date.now()}`,
    problem_profile: profile,
    recommendations: [
      {
        rank: 1,
        is_compass_choice: true,
        title: "AI-Powered Workflow Automation",
        summary: `Implement AI-driven automation for your ${dept} ${workflow} workflow. This solution uses machine learning to handle routine decisions, reducing manual effort by up to 70%.`,
        intervention_category: "ai_implementation",
        fit_score: 8.5,
        confidence: { score: 0.72, label: "moderate", explanation: "Based on 12 comparable implementations across similar organizations. 7 successful outcomes documented." },
        evidence_summary: { overall_tier: "bronze", total_comparables: 12, gold_count: 0, silver_count: 2, bronze_count: 10, failed_comparables: 1, average_evidence_score: 45.3 },
        projected_impact: { label: "40-60% reduction in processing time", low: 40, high: 60, unit: "percent", methodology: "Estimated from comparable implementations", is_sufficiently_supported: true },
        timeline: { low_weeks: 8, high_weeks: 16 },
        why_it_ranked: ["Strong workflow similarity to successful implementations", "Moderate evidence quality with consistent outcomes"],
        comparables: [
          { organization: "TechCorp", industry: "technology", workflow: workflow, intervention: "AI Process Automation", outcome: "55% reduction in processing time", status: "successful", similarity_score: 85, evidence_score: 62, evidence_tier: "silver", supporting_passage: "TechCorp deployed AI automation across their workflow, resulting in significant efficiency gains.", source_title: "Industry Case Study 2024", source_url: "" },
          { organization: "DataFlow Inc", industry: "technology", workflow: workflow, intervention: "ML Pipeline", outcome: "Processing volume increased 3x", status: "successful", similarity_score: 72, evidence_score: 48, evidence_tier: "bronze", supporting_passage: "DataFlow implemented machine learning to triage and route work items automatically.", source_title: "Tech Blog", source_url: "" },
        ],
        negative_evidence: [
          { organization: "LegacySys Co", intervention: "Full AI Replacement", failure_reasons: ["Integration with legacy systems took longer than expected", "User adoption was lower than anticipated"], similarity_score: 65 },
        ],
        alternatives_considered: [
          { family: "Software Implementation", reason: "Lower confidence due to fewer comparable outcomes." },
          { family: "Process Redesign", reason: "Lower projected impact for the effort required." },
        ],
        assumptions: ["AI model accuracy meets required thresholds", "Team has capacity for 8-week implementation", "Data quality is sufficient for model training"],
        risks: ["Integration complexity with existing systems", "Team training and adoption timeline", "Data privacy compliance requirements"],
      },
      {
        rank: 2,
        is_compass_choice: false,
        title: "Software Implementation",
        summary: `Deploy purpose-built software to streamline your ${dept} ${workflow} process.`,
        intervention_category: "software_implementation",
        fit_score: 6.8,
        confidence: { score: 0.58, label: "moderate", explanation: "Based on 8 comparable implementations." },
        evidence_summary: { overall_tier: "bronze", total_comparables: 8, gold_count: 0, silver_count: 1, bronze_count: 7, failed_comparables: 0, average_evidence_score: 38.1 },
        projected_impact: { label: "25-35% efficiency improvement", low: 25, high: 35, unit: "percent", methodology: "Estimated from comparable implementations", is_sufficiently_supported: true },
        timeline: { low_weeks: 4, high_weeks: 10 },
        why_it_ranked: ["Faster implementation timeline", "Lower upfront investment required"],
        comparables: [],
        negative_evidence: [],
        alternatives_considered: [],
        assumptions: [],
        risks: [],
      },
      {
        rank: 3,
        is_compass_choice: false,
        title: "Process Redesign",
        summary: `Re-engineer your ${dept} ${workflow} workflow to eliminate bottlenecks.`,
        intervention_category: "process_redesign",
        fit_score: 5.5,
        confidence: { score: 0.45, label: "limited", explanation: "Based on limited comparable data." },
        evidence_summary: { overall_tier: "bronze", total_comparables: 3, gold_count: 0, silver_count: 0, bronze_count: 3, failed_comparables: 0, average_evidence_score: 25.0 },
        projected_impact: { label: "", low: null, high: null, unit: "", methodology: "", is_sufficiently_supported: false },
        timeline: { low_weeks: 2, high_weeks: 6 },
        why_it_ranked: ["Quickest to implement", "Lowest risk profile"],
        comparables: [],
        negative_evidence: [],
        alternatives_considered: [],
        assumptions: [],
        risks: [],
      },
    ],
    confidence_breakdown: {
      comparable_implementations: 12,
      unique_organizations: 8,
      average_evidence_score: 45.3,
      successful_implementations: 7,
      outcome_measured_implementations: 4,
      quantified_outcome_implementations: 3,
      negative_implementations: 1,
    },
  };
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

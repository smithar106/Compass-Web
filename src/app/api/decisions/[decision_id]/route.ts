import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";
import { getDevRecommendation, isDevRec } from "@/lib/dev-fallback";

export const dynamic = "force-dynamic";

/**
 * A decision can be persisted by either the analyze flow (AnalysisSession,
 * served at /api/analyze/{id}) or the assessment flow (Recommendation, served
 * at /api/recommendations/{id}). Try the analyze endpoint first, then fall
 * back to the recommendation store and normalize it into the same shape the
 * decision page renders.
 */
export async function GET(_req: NextRequest, { params }: { params: { decision_id: string } }) {
  const id = params.decision_id;

  if (isDevRec(id)) {
    const dev = getDevRecommendation(id);
    if (dev) {
      return NextResponse.json({
        decision_id: id,
        analysis: {
          analysis_id: dev.recommendation_id,
          status: "decision_ready",
          created_at: dev.generated_at,
          decision: {
            recommendation_id: dev.recommendation_id,
            recommendations: dev.recommendations,
            methodology: dev.methodology,
            assessment_summary: dev.assessment_summary,
          },
        },
      });
    }
    return NextResponse.json({ error: "Decision not found" }, { status: 404 });
  }

  const analyzeRes = await proxyEngine(`/api/analyze/${encodeURIComponent(id)}`, undefined, 20000);
  if (analyzeRes && analyzeRes.ok) {
    const data = await analyzeRes.json();
    return NextResponse.json({ decision_id: id, analysis: data });
  }

  const recRes = await proxyEngine(`/api/recommendations/${encodeURIComponent(id)}`, undefined, 20000);
  if (recRes && recRes.ok) {
    const rec = await recRes.json();
    return NextResponse.json({
      decision_id: id,
      analysis: {
        analysis_id: rec.recommendation_id || id,
        status: "decision_ready",
        created_at: typeof rec.generated_at === "string" ? rec.generated_at : null,
        decision: {
          recommendation_id: rec.recommendation_id || id,
          recommendations: rec.recommendations || [],
          methodology: rec.methodology || null,
          assessment_summary: rec.assessment_summary || null,
        },
      },
    });
  }

  return NextResponse.json({ error: "Decision not found" }, { status: 404 });
}

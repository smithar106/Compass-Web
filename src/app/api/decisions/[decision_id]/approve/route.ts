import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

/**
 * Approve a decision: records the executive's intervention selection with the
 * engine (the top-ranked intervention), persisting the decision's lifecycle
 * state so the workspace can show it as "Approved".
 */
export async function POST(_req: NextRequest, { params }: { params: { decision_id: string } }) {
  const id = params.decision_id;

  const recRes = await proxyEngine(`/api/recommendations/${encodeURIComponent(id)}`, undefined, 20000);
  if (!recRes || !recRes.ok) {
    return NextResponse.json({ error: "Decision not found" }, { status: 404 });
  }
  const rec = await recRes.json();
  const top = Array.isArray(rec.recommendations) ? rec.recommendations[0] : null;
  const interventionId = top?.intervention_id;
  if (!interventionId) {
    return NextResponse.json({ error: "No intervention available to approve" }, { status: 400 });
  }

  const selRes = await proxyEngine(`/api/recommendations/${encodeURIComponent(id)}/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selected_intervention_id: interventionId }),
  }, 20000);

  if (!selRes || !selRes.ok) {
    return NextResponse.json({ error: "The engine could not record the approval" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, decision_id: id });
}

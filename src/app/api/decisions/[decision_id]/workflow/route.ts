import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

/**
 * Real lifecycle state for a decision, derived from the engine's persisted
 * records: an intervention selection (approved) and a recorded outcome
 * (completed). Returns booleans so the workspace can render honest status.
 */
export async function GET(_req: NextRequest, { params }: { params: { decision_id: string } }) {
  const id = params.decision_id;

  let selected = false;
  const selRes = await proxyEngine(`/api/recommendations/${encodeURIComponent(id)}/selection`, undefined, 10000);
  if (selRes && selRes.ok) selected = true;

  let outcome = false;
  const outRes = await proxyEngine("/api/outcomes?limit=50", undefined, 10000);
  if (outRes && outRes.ok) {
    const data = await outRes.json();
    outcome =
      Array.isArray(data?.outcomes) &&
      data.outcomes.some((o: { recommendation_id?: string }) => o.recommendation_id === id);
  }

  return NextResponse.json({ decision_id: id, selected, outcome });
}

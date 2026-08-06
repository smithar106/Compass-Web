import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

/**
 * Record a measured outcome for a decision with the engine. This is the
 * feedback loop: the outcome is persisted and becomes evidence for future
 * recommendations.
 */
export async function POST(req: NextRequest, { params }: { params: { decision_id: string } }) {
  const id = params.decision_id;
  const body = await req.json().catch(() => ({}));
  const measuredResult = String(body.measured_result ?? "").trim();
  if (!measuredResult) {
    return NextResponse.json({ error: "measured_result is required" }, { status: 400 });
  }
  const realizedCost = typeof body.realized_cost === "number" ? body.realized_cost : undefined;

  const outRes = await proxyEngine("/api/outcomes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recommendation_id: id,
      organization_name: "",
      measured_result: measuredResult,
      realized_cost: realizedCost,
    }),
  }, 20000);

  if (!outRes || !outRes.ok) {
    return NextResponse.json({ error: "The engine could not record the outcome" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, decision_id: id });
}

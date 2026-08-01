import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { decision_id: string } }) {
  const res = await proxyEngine(`/api/analyze/${encodeURIComponent(params.decision_id)}`, undefined, 20000);
  if (res && res.ok) {
    const data = await res.json();
    return NextResponse.json({ decision_id: params.decision_id, analysis: data });
  }
  return NextResponse.json({ error: "Decision not found" }, { status: 404 });
}

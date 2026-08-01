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

export async function POST(req: NextRequest, { params }: { params: { decision_id: string } }) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const res = await proxyEngine(`/api/decisions/${encodeURIComponent(params.decision_id)}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: String(body.email || "") }),
  });
  if (res && res.ok) return res;
  return NextResponse.json({ error: "Could not save decision" }, { status: 502 });
}

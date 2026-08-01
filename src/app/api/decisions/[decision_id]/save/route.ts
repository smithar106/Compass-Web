import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

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

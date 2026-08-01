import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { implementation_id: string } }) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const res = await proxyEngine(`/api/implementations/${encodeURIComponent(params.implementation_id)}/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res && res.ok) return res;
  return NextResponse.json({ error: "Could not submit introduction request" }, { status: 502 });
}

import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { implementation_id: string; token: string } }
) {
  const res = await proxyEngine(
    `/api/implementations/${encodeURIComponent(params.implementation_id)}/invite/${encodeURIComponent(params.token)}`,
    undefined,
    20000
  );
  if (res && res.ok) return res;
  return NextResponse.json({ error: "Invite invalid or expired" }, { status: 404 });
}

import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { implementation_id: string } }) {
  const res = await proxyEngine(`/api/implementations/${encodeURIComponent(params.implementation_id)}`, undefined, 20000);
  if (res && res.ok) return res;
  return NextResponse.json({ error: "Implementation plan not found" }, { status: 404 });
}

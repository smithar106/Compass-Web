import { NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await proxyEngine("/api/partners", undefined, 15000);
  if (res && res.ok) return res;
  return NextResponse.json({ error: "Partner registry unavailable" }, { status: 502 });
}

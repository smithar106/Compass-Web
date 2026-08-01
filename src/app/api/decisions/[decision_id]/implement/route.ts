import { NextRequest, NextResponse } from "next/server";
import { proxyEngine } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { decision_id: string } }) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const res = await proxyEngine(`/api/analyze/${encodeURIComponent(params.decision_id)}/implement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: body.path === "internal" ? "internal" : "partner",
      partner_id: body.partner_id || null,
      contact_email: String(body.contact_email || ""),
    }),
  });
  if (res && res.ok) return res;
  return NextResponse.json({ error: "Could not create implementation plan" }, { status: 502 });
}

import { NextResponse } from "next/server";
import { compassApiBase } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

/**
 * GET /api/gaps — live Evidence Gap Engine report from the engine.
 *
 * The engine serves /api/evidence/gaps in dual mode: the product-facing read
 * (no agent key) returns the UI-shaped report — decision coverage by business
 * function, dimension coverage, and the ranked shopping list — without the
 * agent-internal hunt directives. This route proxies that report for the
 * product UI (Workspace coverage view).
 */
export async function GET() {
  const base = compassApiBase();
  if (!base) {
    return NextResponse.json({ error: "engine not configured" }, { status: 503 });
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${base}/api/evidence/gaps?top=10`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return NextResponse.json({ error: `engine gaps ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "gaps unavailable" }, { status: 503 });
  }
}

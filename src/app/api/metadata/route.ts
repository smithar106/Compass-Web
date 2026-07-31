import { NextRequest, NextResponse } from "next/server";

const compassApiUrl =
  process.env.COMPASS_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);

export async function GET(_request: NextRequest) {
  if (!compassApiUrl) {
    return NextResponse.json({ error: "Compass Engine URL is not configured." }, { status: 500 });
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${compassApiUrl}/api/metadata`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json({ error: "Metadata unavailable" }, { status: 502 });
    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Metadata unavailable" }, { status: 502 });
  }
}

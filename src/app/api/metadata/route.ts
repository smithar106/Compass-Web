import { NextRequest, NextResponse } from "next/server";

const compassApiUrl =
  process.env.COMPASS_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);

export async function GET(_request: NextRequest) {
  if (!compassApiUrl) {
    return NextResponse.json({ error: "Compass Engine URL is not configured." }, { status: 500 });
  }
  try {
    const fetchMeta = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(`${compassApiUrl}/api/metadata`, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        clearTimeout(timer);
        return null;
      }
    };

    let data = await fetchMeta();
    // Retry once if the engine instance served a stale schema (rolling deploy).
    if (data && data.unique_organizations == null) {
      await new Promise((r) => setTimeout(r, 2000));
      const retry = await fetchMeta();
      if (retry) data = retry;
    }

    if (!data) return NextResponse.json({ error: "Metadata unavailable" }, { status: 502 });
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Metadata unavailable" }, { status: 502 });
  }
}

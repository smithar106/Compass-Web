// Shared server-side fetch of engine metadata. Cached for an hour at the
// data layer with an ISR-friendly revalidation window.

export interface EvidenceMeta {
  published_records?: number;
  unique_organizations?: number;
  industries?: number;
  measured_outcomes?: number;
  decision_questions?: number;
  last_published_at?: string;
}

export async function fetchEvidenceMeta(): Promise<EvidenceMeta | null> {
  const base =
    process.env.COMPASS_API_URL ??
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/metadata`, {
      next: { revalidate: 3600, tags: ["evidence-meta"] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function formatCount(v: unknown): string | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("en-US") : null;
}

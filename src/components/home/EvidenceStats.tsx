import { cn } from "@/lib/utils";

interface EvidenceMeta {
  published_records?: number;
  unique_organizations?: number;
  industries?: number;
  measured_outcomes?: number;
  decision_questions?: number;
  last_published_at?: string;
}

async function fetchMeta(): Promise<EvidenceMeta | null> {
  const base =
    process.env.COMPASS_API_URL ??
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/metadata`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const FALLBACK_PHRASE = "Compass is built on a growing library of verified implementation evidence.";

export async function EvidenceStats({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact" | "line";
  className?: string;
}) {
  const meta = await fetchMeta();
  const n = Number(meta?.published_records);
  const has = Number.isFinite(n) && n > 0;
  const fmt = (v: unknown) => Number(v).toLocaleString("en-US");
  const growth = meta?.last_published_at ? "Updated continuously" : "";

  if (!has) {
    return (
      <p className={cn("text-[13px] leading-relaxed text-muted", className)}>{FALLBACK_PHRASE}</p>
    );
  }
  const m = meta as EvidenceMeta;

  if (variant === "line") {
    return (
      <p className={cn("text-[12.5px] leading-relaxed text-muted", className)}>
        Powered by {fmt(n)} verified implementations · {fmt(m.unique_organizations)} organizations ·{" "}
        {growth || "updated continuously"}
      </p>
    );
  }

  const stats = [
    { value: fmt(n), label: "verified implementations" },
    { value: fmt(m.unique_organizations || 0), label: "organizations" },
    { value: fmt(m.industries || 0), label: "industries" },
    { value: fmt(m.measured_outcomes || 0), label: "measured outcomes" },
  ];

  if (variant === "compact") {
    return (
      <div className={className}>
        <p className="text-[12px] font-medium text-muted">
          Built from <span className="font-bold text-ink">{fmt(n)} verified implementation records</span>
          <span className="text-faint"> and growing</span>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("border border-line bg-surface", className)}>
      <div className="border-b border-line bg-paper/60 px-5 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
          Built from {fmt(n)} verified implementation records
        </p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface px-5 py-4">
            <p className="font-mono text-[24px] font-bold tracking-tight text-ink">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="px-5 py-2 text-[10.5px] text-faint">
        A growing library of verified implementation evidence · {growth || "updated continuously"}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Stage {
  index: number;
  name: string;
  purpose: string;
  status: string;
  indicative: boolean;
}

interface InviteView {
  implementation_id: string;
  partner_name: string;
  partner_status: string;
  decision: {
    title?: string;
    rationale?: string;
    outcome_ranges?: any[];
    risks?: any[];
    assumptions?: any[];
  };
  stages: Stage[];
}

export default function InvitePage() {
  const params = useParams<{ implementation_id: string; token: string }>();
  const [data, setData] = useState<InviteView | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!params.implementation_id || !params.token) return;
    let alive = true;
    (async () => {
      const res = await fetch(
        `/api/implementations/${encodeURIComponent(params.implementation_id)}/invite/${encodeURIComponent(params.token)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        if (alive) setNotFound(true);
        return;
      }
      const d = await res.json();
      if (alive) setData(d);
    })();
    return () => {
      alive = false;
    };
  }, [params.implementation_id, params.token]);

  const accept = async () => {
    setAccepting(true);
    try {
      const res = await fetch(
        `/api/implementations/${encodeURIComponent(params.implementation_id)}/invite/${encodeURIComponent(params.token)}/accept`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }
      );
      if (res.ok) setAccepted(true);
    } finally {
      setAccepting(false);
    }
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">Partner invitation</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Invite invalid or expired</h1>
        <p className="mt-3 text-sm text-muted">This secure link is invalid or has expired. Contact the requester for a new invite.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm text-muted">Loading partner view…</p>
      </div>
    );
  }

  const rangeText = (r: any) =>
    r ? `${r.metric_label}: ${r.low ?? "?"}–${r.high ?? "?"} ${r.unit ?? ""}` : "";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-lg border border-line bg-surface px-4 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Secure partner view</p>
        <p className="mt-0.5 text-[12.5px] text-muted">Invitation for {data.partner_name} · token-scoped and expires in 7 days</p>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink">Introduction request</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        You were asked to consider supporting this decision. Review the brief below, then accept or decline. Accepting records your intent —
        it does not confirm a commercial agreement.
      </p>

      <div className="mt-6 rounded-lg border border-line bg-white p-6 shadow-panel">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Decision brief</p>
        <h2 className="mt-1 text-xl font-bold text-ink">{data.decision.title || "Recommended decision"}</h2>
        {data.decision.rationale && <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{data.decision.rationale}</p>}
        {data.decision.outcome_ranges && data.decision.outcome_ranges.length > 0 && (
          <ul className="mt-3 space-y-1 text-[12.5px] text-ink">
            {(data.decision.outcome_ranges || []).map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent-deep">→</span> {rangeText(r)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-6 shadow-panel">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Proposed implementation plan</p>
        <ol className="mt-4 space-y-3">
          {data.stages.map((s, i) => (
            <li key={s.index} className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-extrabold",
                  "border-line bg-white text-muted"
                )}
              >
                {s.index}
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-ink">{s.name}</p>
                <p className="text-[12px] text-muted">{s.purpose}</p>
                {s.indicative && (
                  <span className="mt-1 inline-flex rounded bg-[#FBF0E0] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7a3b06]">
                    Indicative guidance
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {data.partner_status === "accepted" || accepted ? (
        <div className="mt-6 rounded-lg border border-[#cfe6d8] bg-[#f2faf5] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#14532d]">Request accepted</p>
          <p className="mt-1 text-sm text-ink">
            You accepted this introduction request. The requester will see the updated status. This confirms intent — a commercial agreement is a separate step.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={accept}
            disabled={accepting}
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
          >
            {accepting ? "Recording…" : "Accept request"}
          </button>
          <span className="inline-flex items-center text-[12.5px] text-muted">
            Declining? No action needed — the request simply stays pending.
          </span>
        </div>
      )}
    </div>
  );
}

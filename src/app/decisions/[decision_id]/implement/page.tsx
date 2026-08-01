"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
  capability: string;
  why: string;
  interventions: string[];
  delivery_model: string;
  indicative_timeline: string;
  evidence_basis: string;
  relationship_status: string;
  rating: number;
}

interface Stage {
  index: number;
  name: string;
  purpose: string;
  activities: string[];
  owner: string;
  partner_role: string;
  inputs: string[];
  milestones: string[];
  validation_gate: string;
  status: string;
  evidence_required: string[];
  target_completion: string;
  notes: string;
  indicative: boolean;
  source: string;
}

interface Plan {
  implementation_id: string;
  selected_path: string;
  partner_id: string;
  partner_name: string;
  partner_status: string;
  stages: Stage[];
}

export default function ImplementChoicePage() {
  const params = useParams<{ decision_id: string }>();
  const router = useRouter();
  const [decision, setDecision] = useState<any>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [dRes, pRes] = await Promise.all([
        fetch(`/api/decisions/${encodeURIComponent(params.decision_id)}`, { cache: "no-store" }),
        fetch("/api/partners", { cache: "no-store" }),
      ]);
      if (dRes.ok) {
        const d = await dRes.json();
        if (alive) setDecision(d.analysis?.decision || null);
      }
      if (pRes.ok) {
        const p = await pRes.json();
        if (alive) setPartners(p.partners || []);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params.decision_id]);

  const top = decision?.recommendations?.[0];
  const category = top?.category || "";

  const recommended =
    partners.find((p) => p.interventions.includes(category)) || partners[0] || null;

  const createPlan = async (path: "partner" | "internal", partnerId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/decisions/${encodeURIComponent(params.decision_id)}/implement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, partner_id: partnerId || null }),
      });
      const data = await res.json();
      if (!res.ok || !data.implementation_id) {
        setError(data.error || "Could not create the implementation plan.");
        return;
      }
      router.push(`/implementations/${data.implementation_id}`);
    } catch {
      setError("Could not reach the engine. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const PartnerCard = ({ p, highlight, onClick }: { p: Partner; highlight?: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border bg-white p-5 text-left shadow-panel transition-colors",
        selected?.id === p.id ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink/40"
      )}
    >
      {highlight && (
        <span className="mb-2 inline-flex rounded bg-[#E5F3EA] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#14532d]">
          Recommended match
        </span>
      )}
      <span className="mb-1 ml-2 inline-flex rounded bg-[#FBF0E0] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7a3b06]">
        Demonstration partner
      </span>
      <p className="text-[16px] font-bold text-ink">{p.name}</p>
      <p className="mt-1 text-[12px] font-semibold text-accent-deep">{p.capability}</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{p.why}</p>
      <dl className="mt-4 space-y-1.5 text-[11.5px]">
        {[
          ["Interventions", p.interventions.join(", ")],
          ["Delivery model", p.delivery_model],
          ["Indicative timeline", p.indicative_timeline],
          ["Basis", p.evidence_basis],
          ["Relationship", p.relationship_status],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-28 shrink-0 font-bold uppercase tracking-wide text-faint">{k}</dt>
            <dd className="text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </button>
  );

  if (!decision || !top) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-sm text-muted">Loading decision…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-lg border border-line bg-surface px-4 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Implement this decision</p>
        <p className="mt-0.5 text-[13px] font-medium text-ink">
          {top.title}
          <Link href={`/decisions/${params.decision_id}`} className="ml-2 text-[12px] font-semibold text-accent-deep underline underline-offset-2">
            View decision brief →
          </Link>
        </p>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink">How would you like to implement this decision?</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Choosing a partner never changes the recommendation or ranking — it only selects who could help you deliver it.
        Partner data below is demonstration configuration until a formal relationship exists.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {recommended && (
          <PartnerCard
            p={recommended}
            highlight
            onClick={() => setSelected(recommended)}
          />
        )}
        {partners
          .filter((p) => p.id !== recommended?.id)
          .map((p) => (
            <PartnerCard key={p.id} p={p} onClick={() => setSelected(p)} />
          ))}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface p-6">
        <p className="text-[16px] font-bold text-ink">Implement internally</p>
        <p className="mt-1 max-w-2xl text-[12.5px] text-muted">
          Your team owns the six-stage plan end to end. The plan still includes stage-by-stage guidance, owners, validation gates, and evidence requirements.
        </p>
        <button
          type="button"
          onClick={() => createPlan("internal")}
          disabled={loading}
          className="mt-4 inline-flex items-center gap-2 border border-ink/20 bg-paper px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink disabled:opacity-50"
        >
          Implement internally →
        </button>
      </div>

      {selected && (
        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/15 bg-white p-4 shadow-panel">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Selected</p>
            <p className="truncate text-[14px] font-bold text-ink">{selected.name}</p>
            <p className="text-[11px] text-muted">Demonstration partner — no formal relationship.</p>
          </div>
          <button
            type="button"
            onClick={() => createPlan("partner", selected.id)}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
          >
            {loading ? "Creating plan…" : "Continue with this partner →"}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-[13px] font-semibold text-[#B3261E]">{error}</p>}
    </div>
  );
}

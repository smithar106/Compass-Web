"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DecisionPackageView } from "@/components/analyze/DecisionPackageView";
import {
  createImplementation,
  findImplementationByDecision,
  type ImplementationPhase,
  type TrackedOutcome,
} from "@/lib/implementation";
import { implementationSteps } from "@/lib/brief-text";

interface Analysis {
  analysis_id: string;
  normalization?: any;
  decision?: any;
  status?: string;
  created_at?: string | null;
}

function formatDecisionDate(iso?: string | null): string {
  if (!iso) return "recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "recently";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DecisionPage() {
  const params = useParams<{ decision_id: string }>();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ permalink: string; notification?: any } | null>(null);

  useEffect(() => {
    if (!params.decision_id) return;
    let alive = true;
    (async () => {
      const res = await fetch(`/api/decisions/${encodeURIComponent(params.decision_id)}`, { cache: "no-store" });
      if (!res.ok) {
        if (alive) setNotFound(true);
        return;
      }
      const data = await res.json();
      if (alive) setAnalysis(data.analysis);
    })();
    return () => {
      alive = false;
    };
  }, [params.decision_id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">Permanent decision link</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Decision not found</h1>
        <p className="mt-3 text-sm text-muted">This link is invalid or the decision was never saved. Run a new assessment to create one.</p>
        <Link href="/assessment" className="mt-6 inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink2">
          Start Assessment →
        </Link>
      </div>
    );
  }

  if (!analysis?.decision) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm text-muted">Loading decision…</p>
      </div>
    );
  }

  const decision = analysis.decision;
  const top = decision.recommendations?.[0];

  const saveDecision = () => setShowSave(true);

  const launchImplementation = () => {
    const existing = findImplementationByDecision(params.decision_id);
    if (existing) {
      router.push(`/implementations/${existing.implementationId}`);
      return;
    }

    const steps: ImplementationPhase[] = implementationSteps(top).map((s) => ({
      name: s.name,
      timeline: s.timeline,
      detail: s.detail,
      team: s.team,
      status: "not_started" as const,
    }));

    const savings = (top.impact as any)?.annual_savings;
    const outcomes: TrackedOutcome[] = [];
    if (savings?.status === "estimated" && savings.expected > 0) {
      outcomes.push({
        label: "Expected annual savings",
        target: `$${Math.round(savings.expected).toLocaleString()}`,
        unit: "USD",
      });
    }
    (top.outcome_ranges || []).slice(0, 2).forEach((r: any) => {
      const label = (r.metric_label || "").replace(/_/g, " ");
      if (r.median) {
        outcomes.push({ label: label || "Primary KPI", target: `${r.median}%`, unit: r.unit || "%" });
      }
    });

    const impl = createImplementation({
      decisionId: params.decision_id,
      title: top.title || top.specific_action || "Implementation",
      approvedDecisionSnapshot: decision as Record<string, unknown>,
      phases: steps,
      expectedOutcomes: outcomes,
      owner: "Executive Sponsor",
    });

    router.push(`/implementations/${impl.implementationId}`);
  };

  const submitSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/decisions/${encodeURIComponent(params.decision_id)}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSaved(await res.json());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Permanent decision link</p>
          <p className="mt-0.5 text-[12px] text-muted">This decision is persisted. Share this URL to return to it anytime.</p>
        </div>
      </div>

      <DecisionPackageView
        recs={decision.recommendations || []}
        meta={decision.methodology}
        summary={decision.assessment_summary}
        status={analysis.status}
        recommendationId={decision.recommendation_id}
        decisionModel={decision.methodology?.decision_model || null}
        onImplement={launchImplementation}
        onSave={saveDecision}
      />

      <p className="mt-6 text-[11.5px] text-faint">
        Prepared by Compass &middot; {formatDecisionDate(analysis.created_at)}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <Link href="/workspace" className="text-[13px] font-semibold text-muted transition-colors hover:text-ink">
          Return to Workspace
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/assessment" className="text-[13px] font-semibold text-ink transition-colors hover:text-muted">
            New Decision
          </Link>
          <button
            type="button"
            onClick={saveDecision}
            className="border border-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Save This Decision
          </button>
        </div>
      </div>

      {showSave && !saved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setShowSave(false)}>
          <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel" onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Save this decision</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Keep a permanent link</h2>
            <p className="mt-2 text-[12.5px] text-muted">
              Enter an email to receive a secure resume link, or save without an email — the link below stays valid.
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@company.com"
              className="mt-4 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
            <div className="mt-4 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowSave(false)} className="text-[13px] font-semibold text-muted hover:text-ink">
                Cancel
              </button>
              <button
                type="button"
                onClick={submitSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper hover:bg-ink2 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save decision"}
              </button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="mt-6 rounded-lg border border-[#cfe6d8] bg-[#f2faf5] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#14532d]">Decision saved</p>
          <p className="mt-1 text-sm text-ink">Your permanent link is ready. Anyone with it can view this decision.</p>
          <a
            href={saved.permalink}
            className="mt-3 inline-block break-all text-sm font-semibold text-accent-deep underline underline-offset-2"
          >
            {typeof window !== "undefined" ? `${window.location.origin}${saved.permalink}` : saved.permalink}
          </a>
          {saved.notification && saved.notification.status === "dev_fallback" && (
            <p className="mt-2 text-[12px] text-muted">
              Email delivery is not configured — no email was sent. Set MAILGUN_API_KEY + MAILGUN_DOMAIN (or SMTP_HOST) to enable it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

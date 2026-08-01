"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  decision_id: string;
  analysis_id: string;
  selected_path: string;
  partner_id: string;
  partner_name: string;
  status: string;
  partner_status: string;
  stages: Stage[];
}

interface RequestResult {
  request_id: string;
  status: string;
  notification: { partner: any; user: any };
  permalink: string;
}

const STATUS_LABEL: Record<string, string> = {
  not_requested: "Not requested",
  internal: "Internal team",
  requested: "Request sent",
  accepted: "Accepted by partner",
  submitted: "Submitted",
};

export default function ImplementationPage() {
  const params = useParams<{ implementation_id: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [open, setOpen] = useState<number>(1);
  const [showRequest, setShowRequest] = useState(false);
  const [form, setForm] = useState({ contact_name: "", contact_email: "", organization: "", requested_timeline: "", notes: "", consent: true });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RequestResult | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.implementation_id) return;
    let alive = true;
    (async () => {
      const res = await fetch(`/api/implementations/${encodeURIComponent(params.implementation_id)}`, { cache: "no-store" });
      if (!res.ok) {
        if (alive) setNotFound(true);
        return;
      }
      const data = await res.json();
      if (alive) {
        setPlan(data);
        setOpen(data.stages?.[0]?.index ?? 1);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params.implementation_id]);

  const submitRequest = async () => {
    setSubmitting(true);
    setRequestError(null);
    try {
      const res = await fetch(`/api/implementations/${encodeURIComponent(params.implementation_id)}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: plan?.partner_id,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRequestError(data.error || "Request failed.");
        return;
      }
      setResult(data);
      setShowRequest(false);
    } catch {
      setRequestError("Could not reach the engine.");
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">Implementation plan</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Plan not found</h1>
        <p className="mt-3 text-sm text-muted">This implementation link is invalid. Start from a decision brief to create a plan.</p>
        <Link href="/analyze" className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink2">
          Start an analysis →
        </Link>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm text-muted">Loading implementation plan…</p>
      </div>
    );
  }

  const partnerActive = plan.selected_path === "partner";
  const canRequest = partnerActive && plan.partner_status === "not_requested";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-lg border border-line bg-surface px-4 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Live implementation plan</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
          <span className="font-semibold text-ink">{partnerActive ? plan.partner_name : "Internal team"}</span>
          <span className="rounded bg-[#FBF0E0] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7a3b06]">
            {partnerActive ? "Demonstration partner" : "Internal"}
          </span>
          <span className="text-muted">·</span>
          <span className="text-muted">{STATUS_LABEL[plan.partner_status] || plan.partner_status}</span>
          <Link href={`/decisions/${plan.analysis_id}`} className="ml-auto text-[12px] font-semibold text-accent-deep underline underline-offset-2">
            View decision brief →
          </Link>
        </div>
      </div>

      {canRequest && !result && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d9e4f2] bg-[#f4f8fd] px-4 py-3">
          <p className="text-[12.5px] text-ink">
            Request an introduction to <span className="font-bold">{plan.partner_name}</span> — the partner gets a secure link to
            review and accept your decision.
          </p>
          <button
            type="button"
            onClick={() => setShowRequest(true)}
            className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper hover:bg-ink2"
          >
            Request Introduction →
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-[#cfe6d8] bg-[#f2faf5] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#14532d]">Request submitted</p>
          <p className="mt-1 text-sm text-ink">Your introduction request to {plan.partner_name} is recorded.</p>
          <dl className="mt-3 space-y-1 text-[12px] text-muted">
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 font-bold uppercase tracking-wide text-faint">Request ID</dt>
              <dd className="font-mono">{result.request_id.slice(0, 8)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 font-bold uppercase tracking-wide text-faint">Status</dt>
              <dd>{result.status}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 font-bold uppercase tracking-wide text-faint">Partner notice</dt>
              <dd>{result.notification.partner.status}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 shrink-0 font-bold uppercase tracking-wide text-faint">Your notice</dt>
              <dd>{result.notification.user.status}</dd>
            </div>
          </dl>
          {result.notification.partner.status === "dev_fallback" && (
            <p className="mt-3 rounded border border-[#f0dcc0] bg-[#fdf6ec] p-3 text-[12px] text-[#7a3b06]">
              Email delivery is not configured, so the notification email was not sent. Set <code className="font-mono">MAILGUN_API_KEY</code>{" "}
              and <code className="font-mono">MAILGUN_DOMAIN</code> (or <code className="font-mono">SMTP_HOST</code>) on the engine to enable real delivery.
              Your request record is stored and the partner invite link remains valid for 7 days.
            </p>
          )}
          <div className="mt-3 text-[12px]">
            <span className="font-semibold text-ink">Partner invite: </span>
            <span className="break-all text-accent-deep underline underline-offset-2">
              {`/implementations/${plan.implementation_id}/invite/${(plan as any).invite_token ?? ""}`}
            </span>
          </div>
        </div>
      )}

      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setShowRequest(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-white p-6 shadow-panel" onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">Request introduction</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{plan.partner_name}</h2>
            <p className="mt-1 text-[12px] text-muted">A secure link to the decision brief will be sent to the partner. Your contact details are shared only with your consent.</p>
            <div className="mt-4 space-y-3">
              {(
                [
                  ["contact_name", "Your name"],
                  ["contact_email", "Work email"],
                  ["organization", "Organization"],
                  ["requested_timeline", "Requested timeline (e.g. 8 weeks)"],
                  ["notes", "Notes for the partner"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-faint">{label}</label>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={label}
                    className="mt-1 w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
              ))}
              <label className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  className="mt-0.5"
                />
                <span className="text-[12px] text-muted">I consent to sharing the decision brief and my contact details with this partner.</span>
              </label>
            </div>
            {requestError && <p className="mt-3 text-[12.5px] font-semibold text-[#B3261E]">{requestError}</p>}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowRequest(false)} className="text-[13px] font-semibold text-muted hover:text-ink">
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRequest}
                disabled={submitting || !form.contact_email || !form.contact_name}
                className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper hover:bg-ink2 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Send request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink">Six-stage implementation plan</h1>
      <p className="mt-1 text-sm text-muted">
        A live journey from baseline to verified outcomes. Content drawn from your decision brief where available; generic steps are labeled
        as indicative guidance.
      </p>

      <ol className="mt-8 space-y-4">
        {plan.stages.map((stage, i) => {
          const isOpen = open === stage.index;
          const isLast = i === plan.stages.length - 1;
          return (
            <li key={stage.index} className="relative">
              <div className="flex gap-4">
                <div className="flex w-9 shrink-0 flex-col items-center">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-extrabold",
                      isOpen ? "border-ink bg-ink text-paper" : "border-line bg-white text-muted"
                    )}
                  >
                    {stage.index}
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-line" />}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : stage.index)}
                  className={cn(
                    "mb-1 flex-1 rounded-lg border bg-white p-4 text-left shadow-panel transition-colors",
                    isOpen ? "border-ink" : "border-line hover:border-ink/40"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-bold text-ink">{stage.name}</p>
                    {stage.indicative && (
                      <span className="rounded bg-[#FBF0E0] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7a3b06]">
                        Indicative implementation guidance
                      </span>
                    )}
                    {!stage.indicative && (
                      <span className="rounded bg-[#E5F3EA] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#14532d]">
                        From your decision brief
                      </span>
                    )}
                    <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide text-faint">{STATUS_LABEL[stage.status] || stage.status}</span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted">{stage.purpose}</p>
                </button>
              </div>

              {isOpen && (
                <div className="ml-[52px] -mt-2 animate-fade-in rounded-lg border border-[#dfe5ec] bg-[#f6f8fa] p-5">
                  <dl className="grid gap-4 md:grid-cols-2">
                    {[
                      ["Purpose", stage.purpose],
                      ["Owner", stage.owner],
                      ["Partner role", stage.partner_role],
                      ["Validation gate", stage.validation_gate],
                      ["Status", stage.status],
                      ["Target completion", stage.target_completion],
                      ["Notes", stage.notes],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">{k}</dt>
                        <dd className="mt-0.5 text-[12.5px] leading-relaxed text-ink">{v || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                  {([
                    ["Key activities", stage.activities],
                    ["Inputs", stage.inputs],
                    ["Milestones", stage.milestones],
                    ["Evidence required", stage.evidence_required],
                  ] as const).map(([label, items]) => (
                    <div key={label as string}>
                      <dt className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">{label}</dt>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[12.5px] text-ink">
                        {items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

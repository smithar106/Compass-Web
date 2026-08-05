"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  type DecisionRec,
} from "@/lib/decision-package";
import { DecisionBriefPrint } from "./DecisionBriefPrint";
import {
  decisionSummary,
  convictionKpis,
  closingRecommendation,
  businessCaseText,
  alternativesRejected,
  riskItems,
  unknownItems,
  assumptionItems,
  implementationRoadmap,
  evidenceStories,
  decisionNotes,
} from "@/lib/brief-text";

export function DecisionPackageView({
  recs,
  meta,
  summary,
  status,
  recommendationId,
  onImplement,
  onSave,
}: {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  recommendationId?: string;
  onImplement?: () => void;
  onSave?: () => void;
}) {
  const [implementing, setImplementing] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [library, setLibrary] = useState<number | null>(null);
  const top = recs[0];

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/metadata", { cache: "no-store" });
        if (res.ok) {
          const m = await res.json();
          const n = Number(m.published_records);
          if (Number.isFinite(n) && n > 0 && alive) setLibrary(n);
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const g = useMemo(() => groundingState(top, meta), [top, meta]);

  if (!top) return null;
  if (status === "insufficient_evidence" || top.confidence?.label === "insufficient") {
    return <InsufficientEvidence rec={top} />;
  }

  const badge =
    g.key === "live"
      ? { text: "Recommended", cls: "bg-[#E5F3EA] text-[#14532d]", dot: "bg-[#1E7B4C]" }
      : g.key === "partial"
        ? { text: "Needs validation", cls: "bg-[#FBF0E0] text-[#7a3b06]", dot: "bg-[#B45309]" }
        : { text: "Insufficient evidence", cls: "bg-[#FAE9E7] text-[#7a1f1a]", dot: "bg-[#C4382C]" };

  if (implementing) {
    return <ImplementationView top={top} recommendationId={recommendationId} onBack={() => setImplementing(false)} />;
  }

  const saveDecision = () => {
    if (onSave) return onSave();
    try {
      const saved = JSON.parse(localStorage.getItem("compass-saved-decisions") || "[]");
      saved.push({ title: top.title, savedAt: new Date().toISOString() });
      localStorage.setItem("compass-saved-decisions", JSON.stringify(saved.slice(-20)));
      alert("Decision saved to this browser.");
    } catch {}
  };

  const kpis = convictionKpis(top);
  const risks = riskItems(top);
  const unknowns = unknownItems(top);
  const assumptions = assumptionItems(top);
  const roadmap = implementationRoadmap(top);
  const stories = evidenceStories(top);

  const cleanScope = summary?.problem_statement
    ? summary.problem_statement.replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim()
    : "";

  return (
    <div className="space-y-5">
      {/* ===== 1. EXECUTIVE RECOMMENDATION — Green ===== */}
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="h-0.5 bg-[#1f9d57]" aria-hidden="true" />
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#14663a]">Executive Recommendation</p>
              <h2 className="mt-0.5 font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink">What should we do?</h2>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-[13.5px] leading-[1.65] text-muted">
            {decisionSummary(top, summary)}
          </p>

          <p className="mt-6 text-[13.5px] leading-[1.6] text-[#3c5645]">
            {closingRecommendation(top)}
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2.5 text-[12.5px] text-[#3c5645]"><span className="mt-px text-[#1f9d57] shrink-0">✓</span>Complete a four-week operational baseline before build.</li>
            <li className="flex items-start gap-2.5 text-[12.5px] text-[#3c5645]"><span className="mt-px text-[#1f9d57] shrink-0">✓</span>{top.next_validation_step?.success_criteria || "Validate results against the agreed baseline before full deployment."}</li>
            <li className="flex items-start gap-2.5 text-[12.5px] text-[#3c5645]"><span className="mt-px text-[#1f9d57] shrink-0">✓</span>Confirm implementation partner or internal team readiness.</li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" disabled aria-disabled="true" title="Feature coming soon"
              className="inline-flex cursor-not-allowed items-center gap-2 bg-[#d3ccc0] px-6 py-3 text-[14px] font-semibold text-[#6c685f]"
            >
              Approve & Implement
              <span className="text-[10px] font-bold uppercase tracking-wide">(Feature Coming Soon)</span>
            </button>
            <button type="button" onClick={() => setPrinting(true)}
              className="inline-flex items-center gap-2 border border-line bg-white px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
            >Download PDF</button>
          </div>
        </div>
      </section>

      {/* ===== 2. BUSINESS CASE — Blue ===== */}
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="h-0.5 bg-[#2563eb]" aria-hidden="true" />
        <div className="p-6 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">Business Case</p>
          <h2 className="mt-0.5 font-serif text-[24px] font-semibold tracking-[-0.01em] text-ink">Why should we do it?</h2>
          <p className="mt-3 max-w-3xl text-[13.5px] leading-[1.65] text-muted">
            {businessCaseText(top, summary)}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {stories.map((s) => {
              const points = s.outcome.split(/[.;]/).filter(Boolean).map(p => p.trim());
              return (
                <div key={s.organization} className="rounded border border-line bg-white p-5 text-center">
                  <p className="text-[15px] font-bold text-ink">{s.organization}</p>
                  <ul className="mt-2.5 space-y-1">
                    {points.map((pt, j) => (
                      <li key={j} className="text-[13px] leading-[1.5] text-muted">&#x2022; {pt}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {stories.length === 0 && (
              <p className="text-[12px] italic text-muted md:col-span-3">No comparable cases were attached.</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== 3. EXECUTION PLAN — Amber ===== */}
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="h-0.5 bg-[#d9932a]" aria-hidden="true" />
        <div className="p-6 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8f5c11]">Execution Plan</p>
          <h2 className="mt-0.5 font-serif text-[24px] font-semibold tracking-[-0.01em] text-ink">How will we do it?</h2>

          <div className="mt-5 space-y-3">
            {roadmap.map((step, i) => (
              <div key={step.label} className="flex items-start gap-4 rounded border border-line bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[11px] font-bold text-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">Objective: {step.label}</p>
                  <p className="mt-0.5 text-[10.5px] font-medium text-muted">Owner: {step.owner}</p>
                  <p className="mt-1 text-[12px] leading-[1.5] text-muted">Detail: {step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <SubHeader>Information needed</SubHeader>
            {unknowns.length > 0 ? (
              <ul className="space-y-2">
                {unknowns.map((u, i) => (
                  <li key={u.title} className="rounded border border-line bg-white px-4 py-3">
                    <p className="text-[12px] font-semibold text-ink">{u.title}</p>
                    <p className="mt-0.5 text-[11px] leading-[1.4] text-muted">{u.why}</p>
                    <p className="mt-1.5 text-[10px] font-medium text-[#8f5c11]">Relevant to step {Math.min(i + 1, 4)} above</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-muted">All information available for the steps above.</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== 4. EVIDENCE LIBRARY — Purple ===== */}
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="h-0.5 bg-[#6a5acd]" aria-hidden="true" />
        <div className="p-6 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#463a9e]">Evidence Library</p>
          <h2 className="mt-0.5 font-serif text-[24px] font-semibold tracking-[-0.01em] text-ink">How do we know this?</h2>
          <p className="mt-2 text-[12.5px] leading-[1.5] text-muted">Supporting evidence and source material backing this recommendation.</p>

          {stories.length > 0 ? (
            <div className="mt-4 space-y-3">
              {stories.map((s) => (
                <div key={s.organization} className="rounded border border-line bg-white p-4">
                  <p className="text-[13px] font-semibold text-ink">{s.organization}</p>
                  <p className="mt-0.5 text-[11.5px] leading-[1.5] text-muted">{s.outcome}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[12px] italic text-muted">No implementations catalogued yet.</p>
          )}

          <p className="mt-4 text-[10.5px] italic leading-[1.5] text-muted">{decisionNotes()}</p>
        </div>
      </section>

      {printing && (
        <DecisionBriefPrint recs={recs} meta={meta} summary={summary} status={status} library={library} onClose={() => setPrinting(false)} />
      )}
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      <span aria-hidden="true" className="h-px flex-1 bg-[#e6e2db]" />
    </div>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>;
}

function ImplementationView({ top, recommendationId, onBack }: { top: DecisionRec; recommendationId?: string; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Back to decision</button>
      <section className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-panel">
        <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-6 py-2.5"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Implement This Plan</p></div>
        <div className="p-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">Recommended implementation path</p>
          <p className="mt-2 text-[14px] font-semibold text-[#101826]">{top.title}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {["Internal team", "Implementation partner", "Custom systems integrator"].map((opt, i) => (
              <button key={opt} type="button" className={cn("rounded-lg border p-4 text-left transition-colors", i === 0 ? "border-ink bg-ink text-paper" : "border-[#e6eaef] bg-surface text-ink hover:border-ink/40")}>
                <p className="text-[13px] font-semibold">{opt}</p>
                <p className={cn("mt-1 text-[11px]", i === 0 ? "text-paper/70" : "text-[#4f6280]")}>{i === 0 ? "Recommended when capability exists in-house." : i === 1 ? "Illustrative — named partner matching pending." : "For larger or cross-system scopes."}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2">Get started</button>
            <button type="button" className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40">Compare partners</button>
            <button type="button" className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40">Implement internally</button>
          </div>
        </div>
      </section>
      <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">Required changes</p>
        <ul className="mt-2 space-y-1.5">
          {(top.specific_intervention?.required_changes || ["Define baseline metrics", "Configure the intervention", "Run a pilot against the validation gate"]).map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-[#4f6280]"><span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InsufficientEvidence({ rec }: { rec: DecisionRec }) {
  return (
    <div className="rounded-xl border border-[#B45309] bg-[#FBF0E0] p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7a3b06]">Insufficient evidence — judgment deferred</p>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#101826]/85">Too few comparable cases were available to make a confident recommendation. The next step below shows what would change that.</p>
      {rec.next_validation_step && (
        <div className="mt-4 rounded-lg border border-[#B45309]/30 bg-white p-4">
          <p className="text-[13px] font-extrabold text-[#101826]">{rec.next_validation_step.action}</p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{rec.next_validation_step.purpose}</p>
          <p className="mt-2 text-[11.5px]"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{rec.next_validation_step.success_criteria}</span></p>
        </div>
      )}
    </div>
  );
}

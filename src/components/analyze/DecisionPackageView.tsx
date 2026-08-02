"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  buildConfidenceFactors,
  type DecisionRec,
} from "@/lib/decision-package";
import { DecisionBriefPrint } from "./DecisionBriefPrint";

interface Kpi {
  label: string;
  value: string;
  caption: string;
  tone?: "ok" | "warn" | "muted";
}

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
    return () => {
      alive = false;
    };
  }, []);

  const g = useMemo(() => groundingState(top, meta), [top, meta]);
  const dd = useMemo(() => defensibilityChecks(top, summary), [top, summary]);
  const factors = useMemo(() => buildConfidenceFactors(top, recs, meta), [top, recs, meta]);

  if (!top) return null;

  if (status === "insufficient_evidence" || top.confidence?.label === "insufficient") {
    return <InsufficientEvidence rec={top} />;
  }

  const kpis = buildKpis(top, meta);

  const badge =
    g.key === "live"
      ? { text: "Defensible", cls: "bg-[#E5F3EA] text-[#14532d]", dot: "bg-[#1E7B4C]" }
      : g.key === "partial"
        ? { text: "Preliminary", cls: "bg-[#FBF0E0] text-[#7a3b06]", dot: "bg-[#B45309]" }
        : { text: "More evidence required", cls: "bg-[#FAE9E7] text-[#7a1f1a]", dot: "bg-[#C4382C]" };

  if (implementing) {
    return <ImplementationView top={top} recommendationId={recommendationId} onBack={() => setImplementing(false)} />;
  }

  const saveDecision = () => {
    if (onSave) {
      onSave();
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("compass-saved-decisions") || "[]");
      saved.push({ title: top.title, savedAt: new Date().toISOString() });
      localStorage.setItem("compass-saved-decisions", JSON.stringify(saved.slice(-20)));
      alert("Decision saved to this browser.");
    } catch {}
  };

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* ===== MASTHEAD — recommendation first ===== */}
      <section className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-panel">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E7B4C] via-[#156ff5] via-[#762ee8] to-[#bb7a00]" aria-hidden="true" />
        <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">
              Executive Decision Brief
            </p>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1E7B4C]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
                <path d="M10.6 5.4 9.5 9.5 5.4 10.6 6.5 6.5z" fill="currentColor" />
              </svg>
              Prepared by Compass
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4f6280]">
                Recommended decision
              </p>
              <h2 className="mt-1.5 font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#101826] sm:text-[30px]">
                {top.title || "Evidence-supported intervention"}
              </h2>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-[13.5px] leading-[1.65] text-[#4f6280]">
            {executiveSummary(top, meta, library)}
          </p>

          {/* proof chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {top.evidence_summary?.total_comparables != null && top.evidence_summary.total_comparables > 0 && (
              <ProofChip label={`${top.evidence_summary.total_comparables} comparable implementations`} />
            )}
            {top.evidence_summary?.overall_tier && (
              <ProofChip label={`Evidence tier: ${top.evidence_summary.overall_tier}`} tone="violet" />
            )}
            {top.evidence_summary && (top.evidence_summary.gold_count ?? 0) > 0 && (
              <ProofChip label={`${top.evidence_summary.gold_count} independently weighted sources`} tone="amber" />
            )}
            {top.category && <ProofChip label={top.category.replace(/_/g, " ")} />}
          </div>

          {/* decision metadata */}
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e6eaef] bg-[#e6eaef] sm:grid-cols-4">
            <MetaCell label="Prepared for" value="Executive Leadership" />
            <MetaCell label="Decision" value={decisionScope(top)} />
            <MetaCell label="Status" value={badge.text} highlight />
            <MetaCell label="Date" value={today} />
          </dl>

          {/* primary actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Feature coming soon"
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 bg-line px-6 py-3 text-[14px] font-semibold text-faint"
            >
              Implement This Plan
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">(Feature Coming Soon)</span>
            </button>
            <button
              type="button"
              onClick={() => setPrinting(true)}
              className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 5V2h8v3M4 11H2.5A1.5 1.5 0 0 1 1 9.5v-3A1.5 1.5 0 0 1 2.5 5h11A1.5 1.5 0 0 1 15 6.5v3A1.5 1.5 0 0 1 13.5 11H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="4" y="10" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Download PDF
            </button>
            <button
              type="button"
              onClick={saveDecision}
              className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Save Decision
            </button>
          </div>
        </div>
      </section>

      {/* ===== 01 THE PROBLEM ===== */}
      <MemoSection number="01" title="The problem">
        <div className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-sm">
          <div className="border-l-4 border-[#C14A3C] bg-[#FAEAE7] px-5 py-4">
            <p className="text-[12.5px] font-semibold leading-[1.55] text-[#8f2f24]">
              {summary?.problem_statement || top.rationale || "An operational workflow is underperforming on cost, time, or quality."}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 p-5 sm:grid-cols-3">
            {buildPainPoints(top, summary).map((p) => (
              <div key={p.label} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[#C14A3C]" />
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8f2f24]">{p.label}</p>
                  <p className="mt-0.5 text-[12px] leading-[1.5] text-[#4f6280]">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MemoSection>

      {/* ===== 02 IMPACT ===== */}
      <MemoSection number="02" title="Impact">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-[#e6eaef] bg-paper/50 p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#4f6280]">{k.label}</p>
              <p className={cn("mt-1 truncate text-[20px] font-extrabold tracking-tight text-[#101826]", k.tone === "warn" && "text-[#B45309]", k.tone === "muted" && "text-[#4f6280]")}>
                {k.value}
              </p>
              <p className="truncate text-[10.5px] text-[#4f6280]">{k.caption}</p>
            </div>
          ))}
        </div>
      </MemoSection>

      {/* ===== 03 WHY NOW ===== */}
      <MemoSection number="03" title="Why this, why now">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>The rationale</SectionLabel>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#4f6280]">
              {top.rationale || "This intervention ranks highest on problem fit, evidence strength, implementation depth, and outcome evidence."}
            </p>
            {top.confidence?.explanation && (
              <p className="mt-3 border-l-2 border-accent-deep pl-3 text-[12.5px] leading-[1.55] text-muted">
                {top.confidence.explanation}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>Why it ranks first</SectionLabel>
            <ul className="mt-2 space-y-2">
              {(top.why_ranked_first?.supporting_reasons || top.why_it_ranked_here || ["Recommendation ranked highest on the evidence criteria applied."]).slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[#101826]/90">
                  <span className="mt-0.5 text-brand-green">&#10003;</span>
                  {r}
                </li>
              ))}
            </ul>
            {factors.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-[#ebeff4] pt-3">
                {factors.slice(0, 4).map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-2 text-[11.5px]">
                    <span className="text-[#4f6280]">{f.label}</span>
                    <span className={cn("font-semibold", f.tone === "ok" ? "text-[#1E7B4C]" : f.tone === "warn" ? "text-[#B45309]" : "text-[#4f6280]")}>{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MemoSection>

      {/* ===== 04 DECISION DEFENSIBILITY ===== */}
      <MemoSection number="04" title="Can we defend it?">
        <div className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6eaef] bg-[#f6f8fa] px-5 py-3">
            <SectionLabel>Decision Defensibility</SectionLabel>
            <span className="font-mono text-[14px] font-bold text-[#1E7B4C]">
              {dd.score} <span className="text-[11px] text-[#4f6280]">/ {dd.total} checks</span>
            </span>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 p-5 sm:grid-cols-2">
            {dd.checks.map((c) => (
              <li key={c.key} className="flex items-start gap-2.5">
                <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", c.ok ? "bg-[#1E7B4C]" : "bg-[#B45309]")} aria-hidden="true">
                  {c.ok ? "✓" : "⚠"}
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-[#101826]">{c.label}</p>
                  <p className="text-[11px] leading-[1.45] text-[#4f6280]">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </MemoSection>

      {/* ===== 05 RISKS & ASSUMPTIONS ===== */}
      <MemoSection number="05" title="Risks & assumptions">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>Risks</SectionLabel>
            {top.risks && top.risks.length > 0 ? (
              <ul className="mt-2 space-y-2.5">
                {top.risks.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12.5px]">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                    <p className="leading-[1.5] text-[#4f6280]"><span className="font-semibold text-[#101826]">{r.title}.</span> {r.mitigation ? `Mitigation: ${r.mitigation}` : r.explanation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[12.5px] italic text-[#4f6280]">No risks were surfaced for this decision.</p>
            )}
          </div>
          <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>Assumptions</SectionLabel>
            {top.assumptions_detail && top.assumptions_detail.length > 0 ? (
              <ul className="mt-2 space-y-2.5">
                {top.assumptions_detail.slice(0, 3).map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12.5px]">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                    <p className="leading-[1.5] text-[#4f6280]"><span className="font-semibold text-[#101826]">{a.title}.</span> {a.explanation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[12.5px] italic text-[#4f6280]">No assumptions were recorded.</p>
            )}
          </div>
        </div>
      </MemoSection>

      {/* ===== 06 IMPLEMENTATION ROADMAP ===== */}
      <MemoSection number="06" title="How we get there">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>Execution path</SectionLabel>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {["Internal team", "Selected partner"].map((opt, i) => (
                <div
                  key={opt}
                  className={cn(
                    "border px-3 py-2 text-[12.5px] font-medium",
                    i === 0 ? "border-ink bg-ink text-paper" : "border-line bg-paper text-muted"
                  )}
                >
                  {opt}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] leading-[1.5] text-[#4f6280]">
              Compass does not implement. Your team or a selected partner executes the plan. Partners
              cannot influence the recommendation.
            </p>
            <div className="mt-4 border-t border-[#ebeff4] pt-4">
              <SectionLabel>Gate before scale</SectionLabel>
              {top.next_validation_step ? (
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-[#4f6280]">
                  <span className="font-semibold text-[#101826]">{top.next_validation_step.action}.</span>{" "}
                  {top.next_validation_step.success_criteria || top.next_validation_step.purpose}
                </p>
              ) : (
                <p className="mt-1.5 text-[12.5px] italic text-[#4f6280]">No validation step defined.</p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>Blueprint phases</SectionLabel>
            <div className="mt-2">
              <BlueprintPhases top={top} />
            </div>
          </div>
        </div>
      </MemoSection>

      {/* ===== 07 THE ALTERNATIVES ===== */}
      <MemoSection number="07" title="The alternatives">
        <div className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-sm">
          <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-5 py-3">
            <SectionLabel>Why the alternatives lost</SectionLabel>
          </div>
          <ul className="divide-y divide-[#ebeff4] px-5">
            {top.alternatives_considered && top.alternatives_considered.length > 0 ? (
              top.alternatives_considered.slice(0, 3).map((a) => (
                <li key={a.family} className="flex items-start gap-3 py-3.5 first:pt-3">
                  <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper">×</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#101826]">{a.family}</p>
                    <p className="text-[11.5px] leading-[1.5] text-[#4f6280]">{a.reason}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-4 text-[12.5px] italic text-[#4f6280]">No alternatives were surfaced by the engine.</li>
            )}
          </ul>
        </div>
      </MemoSection>

      {/* ===== 08 EVIDENCE ===== */}
      <MemoSection number="08" title="Evidence behind this">
        <div className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6eaef] bg-[#f6f8fa] px-5 py-3">
            <SectionLabel>Comparable implementations</SectionLabel>
            <span className="text-[11px] font-medium text-[#4f6280]">
              {library ? `vs ${library} verified implementations` : "vs a growing library"}
            </span>
          </div>
          <div className="p-5">
            {top.comparable_implementations && top.comparable_implementations.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {top.comparable_implementations.slice(0, 3).map((c) => (
                  <li key={c.record_id || c.organization} className="rounded-lg border border-[#e6eaef] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[13px] font-bold text-[#101826]">{c.organization || "Verified implementation"}</span>
                      <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase", c.evidence_tier === "gold" ? "bg-[#fff6d8] text-[#7a5b00]" : c.evidence_tier === "silver" ? "bg-[#f0f3f6] text-[#3f4a5a]" : "bg-[#fff0e6] text-[#7a3b06]")}>
                        {c.evidence_tier || "unknown"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{c.outcome_summary || c.observed_outcome || "Outcome not quantified"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] italic text-[#4f6280]">No comparable implementations were attached by the engine.</p>
            )}
          </div>
        </div>
      </MemoSection>

      {/* ===== 08 OUTCOMES & MEASUREMENT ===== */}
      <MemoSection number="08" title="What we measure">
        <div className="rounded-xl border border-[#dfe5ec] bg-white shadow-sm">
          <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-5 py-3">
            <SectionLabel>Expected impact, measured against a baseline</SectionLabel>
          </div>
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
            {top.outcome_ranges && top.outcome_ranges.some((r) => r.directly_comparable) ? (
              top.outcome_ranges.filter((r) => r.directly_comparable).slice(0, 3).map((r) => (
                <div key={r.metric_label} className="rounded-lg border border-[#e6eaef] bg-paper/50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#4f6280]">{r.metric_label}</p>
                  <p className="mt-1 text-[20px] font-extrabold text-[#101826]">
                    {r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "—"}{r.unit === "%" ? "%" : ""}
                  </p>
                  <p className="text-[10px] text-[#4f6280]">observed in {r.sample_size || 0} comparable implementations</p>
                </div>
              ))
            ) : (
              <p className="text-[12.5px] italic text-[#4f6280]">Outcomes were not quantified in the retrieved records.</p>
            )}
            <div className="flex flex-col justify-center rounded-lg border border-[#e6eaef] bg-paper/50 p-3 sm:col-span-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#4f6280]">Success criteria</p>
              <p className="mt-1 text-[13px] leading-[1.5] text-[#101826]">
                {top.next_validation_step?.success_criteria || top.next_validation_step?.action || "Define the baseline, then validate against the gate before scale."}
              </p>
              <p className="mt-2 text-[11px] leading-[1.5] text-[#4f6280]">
                Verified outcomes flow back into the evidence base &mdash; every implementation improves the next decision.
              </p>
            </div>
          </div>
        </div>
      </MemoSection>

      {/* ===== FINAL DECISION ===== */}
      <section className="overflow-hidden rounded-xl border border-[#1E7B4C]/40 bg-gradient-to-br from-[#f2faf5] to-[#eef6fa] p-6 shadow-sm sm:p-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#14532d]">
          The decision
        </p>
        <h3 className="mt-2 font-serif text-[22px] font-semibold leading-snug tracking-[-0.01em] text-[#101826]">
          Approve {top.title || "this intervention"} as the recommended path.
        </h3>
        <p className="mt-2 max-w-2xl text-[13px] leading-[1.6] text-[#4f6280]">
          Authorize implementation of the recommended intervention, with the validation step and
          success criteria above as the gate before full scale. Compass will track the outcome against
          the baseline and feed the result into future decisions.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Feature coming soon"
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 bg-line px-6 py-3 text-[14px] font-semibold text-faint"
          >
            Approve & Implement This Plan
            <span className="text-[10px] font-bold uppercase tracking-wide text-faint">(Feature Coming Soon)</span>
          </button>
          <button
            type="button"
            onClick={() => setPrinting(true)}
            className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Download Executive Brief (PDF)
          </button>
        </div>
      </section>

      <div className="rounded-lg border border-dashed border-line bg-paper px-4 py-3">
        <p className="text-[11px] leading-[1.55] text-muted">
          <span className="font-semibold text-ink">Grounding note.</span> {g.note}
        </p>
      </div>

      {printing && (
        <DecisionBriefPrint
          recs={recs}
          meta={meta}
          summary={summary}
          status={status}
          library={library}
          onClose={() => setPrinting(false)}
        />
      )}
    </div>
  );
}

function ProofChip({ label, tone = "teal" }: { label: string; tone?: "teal" | "violet" | "amber" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]",
        tone === "teal" && "border-[#bfe8ee] bg-[#e5f6f8] text-[#0a6a78]",
        tone === "violet" && "border-[#d8d4f4] bg-[#eeecfb] text-[#463a9e]",
        tone === "amber" && "border-[#f3dfb6] bg-[#fbf1de] text-[#8f5c11]"
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", tone === "teal" && "bg-[#0e9db0]", tone === "violet" && "bg-[#6a5acd]", tone === "amber" && "bg-[#d9932a]")} />
      {label}
    </span>
  );
}

function MemoSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink font-mono text-[12px] font-bold text-accent">
          {number}
        </span>
        <h3 className="font-serif text-[19px] font-semibold tracking-[-0.01em] text-[#101826]">{title}</h3>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">{children}</p>;
}

function MetaCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("bg-white px-4 py-3", highlight && "bg-[#E5F3EA]")}>
      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#4f6280]">{label}</dt>
      <dd className={cn("mt-0.5 text-[13.5px] font-semibold text-[#101826]", highlight && "text-[#14532d]")}>{value}</dd>
    </div>
  );
}

function decisionScope(top: DecisionRec): string {
  return top.category ? top.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Operational intervention";
}

function buildPainPoints(top: DecisionRec, summary: any): { label: string; text: string }[] {
  const points: { label: string; text: string }[] = [];
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  const riskCount = (top.risks || []).length;
  const gapCount = (top.information_gaps || []).length;

  if (ranges.length > 0) {
    const r = ranges[0];
    const value = r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "";
    points.push({
      label: "Gap today",
      text: `Comparable implementations moved ${r.metric_label || "the metric"} by ${value}${r.unit === "%" ? "%" : ""} — the current process is behind that.`,
    });
  }
  if (gapCount > 0) {
    points.push({
      label: "Missing data",
      text: `${gapCount} material information gap${gapCount > 1 ? "s" : ""} (${top.information_gaps![0].title}) still needs a baseline to close.`,
    });
  }
  if (riskCount > 0) {
    points.push({
      label: "What could go wrong",
      text: `${riskCount} evidence-backed risk${riskCount > 1 ? "s" : ""} to manage — the top one: ${top.risks![0].title}.`,
    });
  }
  if (points.length === 0) {
    points.push({
      label: "The decision",
      text: "This intervention ranks highest on problem fit, evidence strength, and outcome evidence.",
    });
  }
  return points.slice(0, 3);
}


function buildKpis(top: DecisionRec, meta: any): Kpi[] {
  const es = top.evidence_summary || {};
  const ec = meta?.evidence_count || {};
  const score = Math.round((top.confidence?.score || 0) * 100);
  const label = top.confidence?.label || "unknown";
  const total = es.total_comparables || 0;
  const orgs = ec.unique_organizations || 0;

  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  let impact: Kpi = { label: "Expected impact", value: "Pending", caption: "outcome evidence", tone: "muted" };
  if (ranges.length) {
    const r = ranges[0];
    const fmt = r.median != null ? String(r.median) : r.low != null && r.high != null ? `${r.low}–${r.high}` : "";
    const unit = r.unit === "%" ? "%" : r.unit === "currency" ? "$" : "";
    impact = { label: "Expected impact", value: `${fmt}${unit}` || "—", caption: r.metric_label || "outcome", tone: "ok" };
  }

  const tl = top.impact?.implementation_timeline;
  const lo = tl?.min_weeks, hi = tl?.max_weeks;
  let timeline: Kpi = { label: "Timeline", value: "TBD", caption: "estimate", tone: "muted" };
  if (lo || hi) {
    const weeks = hi || lo || 0;
    if (weeks > 8) {
      const mo = Math.max(1, Math.round(weeks / 4.33));
      timeline = { label: "Timeline", value: lo && hi ? `${Math.max(1, Math.round(lo / 4.33))}–${Math.round(hi / 4.33)} mo` : `~${mo} mo`, caption: "estimate", tone: "ok" };
    } else {
      timeline = { label: "Timeline", value: lo && hi ? `${lo}–${hi} wk` : `${lo || hi} wk`, caption: "estimate", tone: "ok" };
    }
  }

  const gaps = (top.information_gaps || []).length;
  const readiness: Kpi =
    gaps > 0
      ? { label: "Readiness", value: "Needs baseline", caption: `${gaps} gap${gaps > 1 ? "s" : ""} to close`, tone: "warn" }
      : { label: "Readiness", value: "Ready", caption: "context complete", tone: "ok" };

  return [
    { label: "Confidence", value: String(score), caption: label, tone: score >= 70 ? "ok" : score >= 50 ? "warn" : "muted" },
    { label: "Evidence", value: String(total), caption: `${orgs ? orgs + " organizations" : "implementations"}`, tone: total >= 5 ? "ok" : "warn" },
    impact,
    timeline,
    readiness,
  ];
}

function executiveSummary(top: DecisionRec, meta: any, library: number | null): string {
  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const libraryLabel = library ? `${library} verified implementations` : "a growing library of verified implementations";
  const base = `Based on organizations similar to yours, Compass recommends ${top.title || "an intervention"} as the highest-confidence option.`;
  if (total > 0) {
    return `${base} This rests on ${total} comparable implementation${total > 1 ? "s" : ""} matched from ${libraryLabel}${orgs ? `, across ${orgs} organizations` : ""}.`;
  }
  return base;
}

function BlueprintPhases({ top }: { top: DecisionRec }) {
  const tl = top.impact?.implementation_timeline;
  const weeks = tl?.expected_weeks || tl?.max_weeks || tl?.min_weeks || 6;
  const phases = [
    { p: "P1", name: "Baseline and metrics setup", dur: "2 wks", owner: "Ops lead", metric: "Baseline locked" },
    { p: "P2", name: "Build, configure, and integrate", dur: `${Math.max(2, Math.ceil(weeks * 0.5))} wks`, owner: "Execution team", metric: "Build complete" },
    { p: "P3", name: "Pilot and validation gate", dur: "3 wks", owner: "Ops + Compass", metric: "Gate: agreed metric met" },
    { p: "P4", name: "Scale and handover", dur: "ongoing", owner: "Operations", metric: "Adoption > 80%" },
  ];
  return (
    <div>
      <ul className="divide-y divide-line/70">
        {phases.map((p) => (
          <li key={p.p} className="flex items-center gap-3 py-3 first:pt-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[9px] font-bold text-muted">
              {p.p}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[13px] font-medium text-ink">{p.name}</span>
                <span className="font-mono text-[10px] text-faint">{p.dur}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                <span className="truncate">{p.owner}</span>
                <span aria-hidden="true" className="text-faint">·</span>
                <span>{p.metric}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImplementationView({ top, recommendationId, onBack }: { top: DecisionRec; recommendationId?: string; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to decision
      </button>

      <section className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-panel">
        <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-6 py-2.5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Implement This Plan</p>
        </div>
        <div className="p-6">
          <SectionLabel>Recommended implementation path</SectionLabel>
          <p className="mt-2 text-[14px] font-semibold text-[#101826]">{top.title}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {["Internal team", "Implementation partner", "Custom systems integrator"].map((opt, i) => (
              <button
                key={opt}
                type="button"
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  i === 0 ? "border-ink bg-ink text-paper" : "border-[#e6eaef] bg-surface text-ink hover:border-ink/40"
                )}
              >
                <p className="text-[13px] font-semibold">{opt}</p>
                <p className={cn("mt-1 text-[11px]", i === 0 ? "text-paper/70" : "text-[#4f6280]")}>
                  {i === 0 ? "Recommended when capability exists in-house." : i === 1 ? "Illustrative — named partner matching pending." : "For larger or cross-system scopes."}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2">
              Get started
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40">
              Compare partners
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40">
              Implement internally
            </button>
          </div>

          {recommendationId && (
            <p className="mt-4 text-[11.5px] text-[#4f6280]">
              A printable brief is available:{" "}
              <a href={`/api/recommendations/pdf?rec_id=${encodeURIComponent(recommendationId)}`} target="_blank" rel="noreferrer" className="font-semibold text-accent-deep underline underline-offset-2">
                Download PDF
              </a>
            </p>
          )}
        </div>
      </section>

      <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Required changes</SectionLabel>
        <ul className="mt-2 space-y-1.5">
          {(top.specific_intervention?.required_changes || ["Define baseline metrics", "Configure the intervention", "Run a pilot against the validation gate"]).map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-[#4f6280]">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />{c}
            </li>
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
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#101826]/85">
        Compass found evidence for the general intervention category but not enough highly comparable
        implementations to make a defensible decision. The next validation step below shows what would change that.
      </p>
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

"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  buildConfidenceFactors,
  avgComparableSimilarity,
  type DecisionRec,
} from "@/lib/decision-package";

type Tab = "overview" | "evidence" | "implementation" | "partners" | "measurement" | "advanced";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "evidence", label: "Evidence" },
  { id: "implementation", label: "Implementation" },
  { id: "partners", label: "Partners" },
  { id: "measurement", label: "Measurement" },
  { id: "advanced", label: "Advanced" },
];

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
}: {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  recommendationId?: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [implementing, setImplementing] = useState(false);
  const top = recs[0];

  const g = useMemo(() => groundingState(top, meta), [top, meta]);
  const dd = useMemo(() => defensibilityChecks(top, summary), [top, summary]);

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
    if (recommendationId) {
      window.open(`/api/recommendations/pdf?rec_id=${encodeURIComponent(recommendationId)}`, "_blank");
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("compass-saved-decisions") || "[]");
      saved.push({ title: top.title, savedAt: new Date().toISOString() });
      localStorage.setItem("compass-saved-decisions", JSON.stringify(saved.slice(-20)));
      alert("Decision saved to this browser.");
    } catch {}
  };

  return (
    <div className="space-y-4">
      {/* ===== HERO — above the fold ===== */}
      <section className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-panel">
        <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-6 py-2.5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">
            Executive Decision Brief
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4f6280]">
                Recommended decision
              </p>
              <h2 className="mt-1 text-[26px] font-extrabold tracking-[-0.02em] text-[#101826]">
                {top.title || "Evidence-supported intervention"}
              </h2>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-[1.6] text-[#4f6280]">
                {executiveSummary(top, meta)}
              </p>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          {/* KPI cards */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-[#e6eaef] bg-paper/50 p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#4f6280]">{k.label}</p>
                <p className={cn("mt-1 truncate text-[18px] font-extrabold tracking-tight text-[#101826]", k.tone === "warn" && "text-[#B45309]", k.tone === "muted" && "text-[#4f6280]")}>
                  {k.value}
                </p>
                <p className="truncate text-[10px] text-[#4f6280]">{k.caption}</p>
              </div>
            ))}
          </div>

          {/* primary actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setImplementing(true)}
              className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              Implement This Plan
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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

      {/* ===== TABS ===== */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors",
              tab === t.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="animate-fade-in">
        {tab === "overview" && <OverviewTab top={top} dd={dd} meta={meta} />}
        {tab === "evidence" && <EvidenceTab top={top} />}
        {tab === "implementation" && <ImplementationContent top={top} />}
        {tab === "partners" && <PartnersTab top={top} />}
        {tab === "measurement" && <MeasurementTab top={top} />}
        {tab === "advanced" && <AdvancedTab top={top} recs={recs} meta={meta} summary={summary} />}
      </div>
    </div>
  );
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
    { label: "Evidence", value: String(total), caption: "implementations", tone: total >= 5 ? "ok" : "warn" },
    impact,
    timeline,
    readiness,
  ];
}

function executiveSummary(top: DecisionRec, meta: any): string {
  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const base = `Based on organizations similar to yours, Compass recommends ${top.title || "an intervention"} as the highest-confidence option.`;
  if (total > 0) {
    return `${base} This rests on ${total} comparable implementation${total > 1 ? "s" : ""}${orgs ? ` across ${orgs} organizations` : ""}.`;
  }
  return base;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">{children}</p>;
}

/* ---------------- Overview ---------------- */

function OverviewTab({ top, dd, meta }: { top: DecisionRec; dd: ReturnType<typeof defensibilityChecks>; meta: any }) {
  const [showDefensibility, setShowDefensibility] = useState(false);
  const reasons = (top.why_ranked_first as any)?.supporting_reasons || top.why_it_ranked_here || [];
  const alternatives = top.alternatives_considered || [];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Why this decision</SectionLabel>
        {top.rationale && <p className="mt-2 text-[12.5px] leading-[1.6] text-[#4f6280]">{top.rationale}</p>}
        <ul className="mt-3 space-y-1.5">
          {(reasons.slice(0, 4) as string[]).map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#101826]/90">
              <span className="mt-0.5 text-brand-green">&#10003;</span>{r}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Why not the alternatives</SectionLabel>
        {alternatives.length === 0 ? (
          <p className="mt-2 text-[12.5px] italic text-[#4f6280]">No alternatives were surfaced by the engine.</p>
        ) : (
          <ul className="mt-2 divide-y divide-[#ebeff4]">
            {alternatives.slice(0, 4).map((a) => (
              <li key={a.family} className="py-2.5 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-semibold text-[#101826]">{a.family}</span>
                  <span aria-hidden="true" className="text-[11px] text-[#B45309]">lost</span>
                </div>
                <p className="text-[11.5px] leading-[1.5] text-[#4f6280]">{a.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm lg:col-span-2">
        <button
          type="button"
          onClick={() => setShowDefensibility((v) => !v)}
          aria-expanded={showDefensibility}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <SectionLabel>Can I defend this decision?</SectionLabel>
          <span className="font-mono text-[14px] font-bold text-[#1E7B4C]">
            {dd.score} <span className="text-[11px] text-[#4f6280]">/ {dd.total}</span>
          </span>
        </button>
        {showDefensibility && (
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {dd.checks.map((c) => (
              <li key={c.key} className="flex items-start gap-2.5">
                <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", c.ok ? "bg-[#1E7B4C]" : "bg-[#B45309]")} aria-hidden="true">
                  {c.ok ? "✓" : "⚠"}
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-[#101826]">{c.label}</p>
                  <p className="text-[11px] leading-[1.45] text-[#4f6280]">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ---------------- Evidence ---------------- */

function EvidenceTab({ top }: { top: DecisionRec }) {
  const comparables = top.comparable_implementations || [];
  const withSource = comparables.filter((c) => c.source_url).length;
  return (
    <section className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-sm">
      <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-5 py-3">
        <SectionLabel>Evidence behind this decision</SectionLabel>
      </div>
      <div className="p-5">
        {comparables.length === 0 ? (
          <p className="text-[12.5px] italic text-[#4f6280]">No comparable implementations were attached by the engine.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {comparables.slice(0, 6).map((c) => (
              <li key={c.record_id || c.organization} className="rounded-lg border border-[#e6eaef] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-bold text-[#101826]">{c.organization || "Verified implementation"}</span>
                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wide text-[#4f6280]">
                    <span className={cn("rounded px-1.5 py-0.5", c.evidence_tier === "gold" ? "bg-[#fff6d8] text-[#7a5b00]" : c.evidence_tier === "silver" ? "bg-[#f0f3f6] text-[#3f4a5a]" : "bg-[#fff0e6] text-[#7a3b06]")}>
                      {c.evidence_tier || "unknown"}
                    </span>
                    <span>sim {c.similarity_score || 0}%</span>
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-[11.5px] leading-[1.5]">
                  {c.intervention && <p><span className="font-semibold text-[#101826]">Recommendation:</span> <span className="text-[#4f6280]">{c.intervention}</span></p>}
                  <p><span className="font-semibold text-[#101826]">Outcome:</span> <span className="text-[#4f6280]">{c.outcome_summary || c.observed_outcome || "Not quantified"}</span></p>
                  {c.supporting_passage && (
                    <p className="italic text-[#4f6280]">&ldquo;{c.supporting_passage.slice(0, 180)}&rdquo;</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 border-t border-[#ebeff4] pt-3 text-[11px] leading-[1.5] text-[#4f6280]">
          Provenance: {withSource} of {comparables.length} records carry a resolvable source link. Records are fully
          traceable only once their source can be opened.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Implementation ---------------- */

function ImplementationContent({ top }: { top: DecisionRec }) {
  const si = (top.specific_intervention as any) || {};
  const steps = top.next_validation_step;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Recommended execution path</SectionLabel>
        <p className="mt-2 text-[14px] font-semibold text-[#101826]">{top.title}</p>
        {si.required_changes && si.required_changes.length > 0 && (
          <>
            <SectionLabel>Required changes</SectionLabel>
            <ul className="mt-2 space-y-1.5">
              {si.required_changes.map((c: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-[#4f6280]">
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />{c}
                </li>
              ))}
            </ul>
          </>
        )}
        {si.prerequisites && si.prerequisites.length > 0 && (
          <>
            <SectionLabel>Prerequisites</SectionLabel>
            <ul className="mt-2 space-y-1">
              {si.prerequisites.map((p: string, i: number) => (
                <li key={i} className="text-[11.5px] text-[#4f6280]">• {p}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Validation before scaling</SectionLabel>
        {steps ? (
          <div className="mt-2 rounded-lg border border-[#e6eaef] bg-paper/50 p-3">
            <p className="text-[13px] font-bold text-[#101826]">{steps.action}</p>
            <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{steps.purpose}</p>
            <p className="mt-2 text-[11.5px]"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{steps.success_criteria}</span></p>
            {steps.owner && <p className="text-[11.5px]"><span className="font-bold text-[#4f6280]">Owner: </span><span className="text-[#101826]">{steps.owner}</span></p>}
          </div>
        ) : (
          <p className="mt-2 text-[12.5px] italic text-[#4f6280]">No validation step was defined for this decision.</p>
        )}
        <RisksList top={top} />
      </section>
    </div>
  );
}

function RisksList({ top }: { top: DecisionRec }) {
  const risks = top.risks || [];
  if (!risks.length) return null;
  return (
    <div className="mt-4">
      <SectionLabel>Risks identified from evidence</SectionLabel>
      <ul className="mt-2 space-y-2">
        {risks.slice(0, 3).map((r, i) => (
          <li key={i} className="text-[11.5px]">
            <p className="font-semibold text-[#101826]">{r.title}</p>
            <p className="text-[#4f6280]">{r.explanation}</p>
            {r.mitigation && <p className="text-[#1E7B4C]">Mitigation: {r.mitigation}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Partners (honest: capability-level) ---------------- */

function PartnersTab({ top }: { top: DecisionRec }) {
  const family = (top.category || "").replace(/_/g, " ").toLowerCase();
  return (
    <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
      <SectionLabel>Recommended implementation path</SectionLabel>
      <div className="mt-3 rounded-lg border border-accent-deep/30 bg-accent-soft/50 p-4">
        <p className="text-[14px] font-semibold text-[#101826]">
          {top.category === "Workflow_Automation" ? "Workflow automation specialist" : family || "Implementation specialist"}
        </p>
        <p className="mt-1 text-[12px] leading-[1.5] text-[#4f6280]">
          Best capability match for {family || "this intervention"}, with a strong implementation history and
          comparable organizations that deployed similar solutions successfully.
        </p>
        <p className="mt-2 text-[11px] italic text-[#8A93A3]">
          Illustrative — named partner matching is not live yet. A partner registry with capabilities, industries,
          and verified outcomes is required before specific companies are recommended.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {["Internal team", "Implementation partner", "Custom systems integrator"].map((opt, i) => (
          <button
            key={opt}
            type="button"
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              i === 1 ? "border-ink bg-ink text-paper" : "border-[#e6eaef] bg-surface text-ink hover:border-ink/40"
            )}
          >
            <p className="text-[13px] font-semibold">{opt}</p>
            <p className={cn("mt-1 text-[11px]", i === 1 ? "text-paper/70" : "text-[#4f6280]")}>
              {i === 0 ? "Recommended when capability exists in-house." : i === 1 ? "Illustrative — partner matching pending." : "For larger or cross-system scopes."}
            </p>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[#4f6280]">
        Partners are considered only after you select the intervention. They cannot influence the recommendation.
      </p>
    </div>
  );
}

/* ---------------- Measurement ---------------- */

function MeasurementTab({ top }: { top: DecisionRec }) {
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  const steps = top.next_validation_step;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Expected operational impact</SectionLabel>
        {ranges.length === 0 ? (
          <p className="mt-2 text-[12.5px] italic text-[#4f6280]">Outcomes were not quantified in the retrieved records.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ranges.slice(0, 4).map((r) => (
              <div key={r.metric_label} className="rounded-lg border border-[#e6eaef] bg-paper/50 p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#4f6280]">{r.metric_label}</p>
                <p className="mt-1 text-[17px] font-extrabold text-[#101826]">
                  {r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "—"}{r.unit === "%" ? "%" : ""}
                </p>
                <p className="text-[10px] text-[#4f6280]">observed in {r.sample_size} comparable implementations</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>How success is measured</SectionLabel>
        {steps ? (
          <div className="mt-2 rounded-lg border border-[#e6eaef] bg-paper/50 p-3">
            <p className="text-[13px] font-bold text-[#101826]">{steps.action}</p>
            <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{steps.purpose}</p>
            <p className="mt-2 text-[11.5px]"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{steps.success_criteria}</span></p>
            {steps.duration && <p className="text-[11.5px]"><span className="font-bold text-[#4f6280]">Duration: </span><span className="text-[#101826]">{steps.duration}</span></p>}
          </div>
        ) : (
          <p className="mt-2 text-[12.5px] italic text-[#4f6280]">No measurement plan defined yet.</p>
        )}
      </section>
    </div>
  );
}

/* ---------------- Advanced ---------------- */

function AdvancedTab({ top, recs, meta, summary }: { top: DecisionRec; recs: DecisionRec[]; meta: any; summary: any }) {
  const factors = buildConfidenceFactors(top, recs, meta);
  const assumptions = top.assumptions_detail || [];
  const gaps = top.information_gaps || [];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Confidence factors</SectionLabel>
        <p className="mt-1 text-[11px] text-[#4f6280]">
          Explainable factors instead of a single precise percentage — a single number would imply more precision than the current model supports.
        </p>
        <ul className="mt-2">
          {factors.map((f) => (
            <li key={f.label} className="border-b border-[#ebeff4] py-2 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-semibold text-[#101826]">{f.label}</span>
                <span className={cn("text-[12px] font-extrabold", f.tone === "ok" ? "text-[#1E7B4C]" : f.tone === "warn" ? "text-[#B45309]" : "text-[#4f6280]")}>{f.value}</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-[1.5] text-[#4f6280]">{f.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-4">
        {assumptions.length > 0 && (
          <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>Assumptions that could change this decision</SectionLabel>
            <ul className="mt-2 space-y-2">
              {assumptions.slice(0, 4).map((a) => (
                <li key={a.title} className="text-[11.5px]">
                  <p className="font-bold text-[#101826]">{a.title}</p>
                  <p className="text-[#4f6280]">{a.explanation}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        {gaps.length > 0 && (
          <section className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
            <SectionLabel>What is missing</SectionLabel>
            <ul className="mt-2 space-y-2">
              {gaps.slice(0, 4).map((g) => (
                <li key={g.title} className="text-[11.5px]">
                  <p className="font-bold text-[#101826]">{g.title}</p>
                  <p className="text-[#4f6280]">{g.explanation}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------------- Implement This Plan ---------------- */

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
          <SectionLabel>Recommended implementation partner</SectionLabel>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4 rounded-lg border border-accent-deep/30 bg-accent-soft/50 p-4">
            <div>
              <p className="text-[16px] font-extrabold text-[#101826]">
                {top.category === "Workflow_Automation" ? "Workflow automation specialist" : (top.category || "Implementation").replace(/_/g, " ")}
              </p>
              <ul className="mt-2 space-y-1 text-[12px] text-[#4f6280]">
                <li>• Best capability match for {top.category || "this intervention"}</li>
                <li>• Strong implementation history for this intervention type</li>
                <li>• Comparable organizations deployed similar solutions successfully</li>
              </ul>
              <p className="mt-2 text-[11px] italic text-[#8A93A3]">
                Illustrative — named partner matching is not live yet.
              </p>
            </div>
            <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-accent">Strong fit</span>
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

      <ImplementationContent top={top} />
    </div>
  );
}

/* ---------------- Insufficient ---------------- */

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

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { groundingState, type DecisionRec } from "@/lib/decision-package";
import { DecisionBriefPrint } from "./DecisionBriefPrint";
import {
  actionTitle,
  recommendationExplanation,
  impactCards,
  evidenceCards,
  evidenceIntro,
  strategyCards,
  implementationSteps,
} from "@/lib/brief-text";

const COLORS = {
  decision: { bg: "#e9f5ec", label: "#14663a" },
  evidence: { bg: "#e8f0fe", label: "#1e40af" },
  strategy: { bg: "#fdf3e0", label: "#8f5c11" },
  implementation: { bg: "#f0ebfa", label: "#463a9e" },
} as const;

export function DecisionPackageView({
  recs,
  meta,
  summary,
  status,
  recommendationId,
  onImplement,
}: {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  recommendationId?: string;
  onImplement?: () => void;
  onSave?: () => void;
}) {
  const [printing, setPrinting] = useState(false);
  const top = recs[0];

  if (!top) return null;
  if (status === "insufficient_evidence" || top.confidence?.label === "insufficient") {
    return <InsufficientEvidence rec={top} />;
  }

  const g = groundingState(top, meta);
  const badge = g.key === "live" ? { text: "Recommended for Pilot Approval", cls: "bg-[#E5F3EA] text-[#14532d]", dot: "bg-[#1E7B4C]" }
    : g.key === "partial" ? { text: "Recommended – Pilot Before Scale", cls: "bg-[#FBF0E0] text-[#7a3b06]", dot: "bg-[#B45309]" }
    : { text: "Insufficient evidence", cls: "bg-[#FAE9E7] text-[#7a1f1a]", dot: "bg-[#C4382C]" };

  const explanation = recommendationExplanation(top, summary);
  const impacts = impactCards(top);
  const evidences = evidenceCards(top, summary);
  const strategies = strategyCards(top);
  const steps = implementationSteps(top);

  return (
    <div className="space-y-0">
      {/* ===== 1. DECISION RECOMMENDATION ===== */}
      <section data-testid="section-decision" className="px-4 py-8 sm:px-8 sm:py-10" style={{ backgroundColor: COLORS.decision.bg }}>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 data-testid="decision-title" className="font-serif text-[30px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[36px]">
                {actionTitle(top)}
              </h1>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-[14px] leading-[1.65] text-ink">
            {explanation.one} {explanation.two} {explanation.three}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {impacts.map((c) => (
              <div key={c.label} data-testid="impact-card" className="rounded-lg border border-line bg-white px-5 py-5">
                <p className="text-[28px] font-extrabold leading-none tracking-tight text-ink">{c.metric}</p>
                <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.08em] text-ink">{c.label}</p>
                <p className="mt-1 text-[12px] leading-[1.4] text-ink">{c.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 2. EVIDENCE ===== */}
      <section data-testid="section-evidence" className="px-4 py-7 sm:px-8 sm:py-8" style={{ backgroundColor: COLORS.evidence.bg }}>
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: COLORS.evidence.label }}>Evidence</p>
          <p className="mt-1 text-[13px] font-medium text-ink">{evidenceIntro(top)}</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {evidences.slice(0, 3).map((e) => (
              <div key={e.company} data-testid="evidence-card" className="rounded-lg bg-white px-5 py-5">
                <p className="text-[15px] font-bold text-ink">{e.company}</p>
                {e.context && <p className="mt-1 text-[12px] leading-[1.45] text-ink/75">{e.context}</p>}
                <ul className="mt-2 space-y-1.5">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] leading-[1.5] text-ink">
                      <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {evidences.length === 0 && (
              <div className="rounded-lg bg-white px-5 py-5 sm:col-span-3">
                <p className="text-[13px] italic text-ink">Evidence is being catalogued.</p>
              </div>
            )}
            {evidences.length > 0 && evidences.length < 3 && (
              <div className="rounded-lg border border-dashed border-line bg-white/50 px-5 py-5 flex items-center justify-center">
                <p className="text-[12px] italic text-ink">Insufficient evidence</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 3. STRATEGY AND OBJECTIVES ===== */}
      <section data-testid="section-strategy" className="px-4 py-7 sm:px-8 sm:py-8" style={{ backgroundColor: COLORS.strategy.bg }}>
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: COLORS.strategy.label }}>Strategy and Objectives</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {strategies.map((s) => (
              <div key={s.heading} data-testid="strategy-card" className="rounded-lg bg-white px-5 py-5">
                <p className="text-[16px] font-bold text-ink">{s.heading}</p>
                <p className="mt-2 text-[13px] leading-[1.5] text-ink">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. IMPLEMENTATION ===== */}
      <section data-testid="section-implementation" className="px-4 py-7 sm:px-8 sm:py-8" style={{ backgroundColor: COLORS.implementation.bg }}>
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: COLORS.implementation.label }}>Implementation</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div key={s.name} data-testid="implementation-step" className="rounded-lg bg-white px-5 py-4">
                <p className="text-[16px] font-bold text-ink">Phase {i + 1}: {s.name}</p>
                <p className="mt-2 text-[12px] font-semibold text-ink">Team Responsible: <span className="font-medium text-ink">{s.team}</span></p>
                <p className="mt-0.5 text-[12px] font-semibold text-ink">Duration: <span className="font-medium text-ink">{s.timeline}</span></p>
                <p className="mt-2 text-[13px] leading-[1.5] text-ink">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" data-testid="download-pdf" onClick={() => setPrinting(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
            >Download Brief as PDF</button>
            <button
              type="button"
              data-testid="view-implementation-plan"
              onClick={() => onImplement?.()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/25 bg-white px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink"
            >
              View Implementation Plan
            </button>
          </div>
        </div>
      </section>

      {printing && (
        <DecisionBriefPrint recs={recs} meta={meta} summary={summary} status={status} onClose={() => setPrinting(false)} />
      )}
    </div>
  );
}

function InsufficientEvidence({ rec }: { rec: DecisionRec }) {
  return (
    <div className="rounded-xl border border-[#B45309] bg-[#FBF0E0] p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7a3b06]">Insufficient evidence — judgment deferred</p>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#101826]/85">Too few comparable cases were available to make a confident recommendation. Additional data has been requested.</p>
      {rec.next_validation_step && (
        <div className="mt-4 rounded-lg border border-[#B45309]/30 bg-white p-4">
          <p className="text-[13px] font-extrabold text-[#101826]">{rec.next_validation_step.action}</p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{rec.next_validation_step.purpose}</p>
        </div>
      )}
    </div>
  );
}

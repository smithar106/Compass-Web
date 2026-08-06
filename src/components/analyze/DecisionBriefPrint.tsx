"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { groundingState, type DecisionRec } from "@/lib/decision-package";
import {
  actionTitle,
  recommendationExplanation,
  impactCards,
  evidenceCards,
  evidenceIntro,
  strategyCards,
  implementationSteps,
} from "@/lib/brief-text";

interface DecisionBriefPrintProps { recs: DecisionRec[]; meta: any; summary: any; status?: string; onClose: () => void; }

const PC = {
  decision: { bg: "#e9f5ec", label: "#14663a" },
  evidence: { bg: "#e8f0fe", label: "#1e40af" },
  strategy: { bg: "#fdf3e0", label: "#8f5c11" },
  implementation: { bg: "#f0ebfa", label: "#463a9e" },
} as const;

export function DecisionBriefPrint({ recs, meta, summary, status, onClose }: DecisionBriefPrintProps) {
  const top = recs[0];

  const handleDownload = useCallback(() => {
    const source = document.getElementById("compass-brief-print");
    if (!source) return;
    const clone = source.cloneNode(true) as HTMLElement;
    clone.id = "compass-brief-print-clone";
    clone.style.position = "static"; clone.style.width = "100%"; clone.style.maxWidth = "none";
    clone.style.margin = "0"; clone.style.boxShadow = "none"; clone.style.borderRadius = "0";
    const holder = document.createElement("div");
    holder.id = "compass-brief-print-holder";
    document.body.appendChild(holder); holder.appendChild(clone);
    const cleanup = () => { document.body.classList.remove("printing-brief"); holder.remove(); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    document.body.classList.add("printing-brief");
    window.print();
    setTimeout(() => { if (document.body.contains(holder)) cleanup(); }, 2000);
  }, []);

  if (!top) return null;
  const g = groundingState(top, meta);
  const badge = g.key === "live" ? { text: "Recommended for Pilot Approval", dot: "bg-[#1E7B4C]", cls: "bg-[#E5F3EA] text-[#14532d]" }
    : g.key === "partial" ? { text: "Recommended – Pilot Before Scale", dot: "bg-[#B45309]", cls: "bg-[#FBF0E0] text-[#7a3b06]" }
    : { text: "Insufficient evidence", dot: "bg-[#C4382C]", cls: "bg-[#FAE9E7] text-[#7a1f1a]" };

  const explanation = recommendationExplanation(top, summary);
  const impacts = impactCards(top);
  const evidences = evidenceCards(top, summary);
  const strategies = strategyCards(top);
  const steps = implementationSteps(top);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#101826]/70 p-4 sm:p-8" data-testid="print-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mx-auto max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between rounded-lg border border-line bg-white px-5 py-3">
          <p className="text-[12px] font-semibold text-ink">Print preview &middot; Prepared by Compass</p>
          <button type="button" onClick={handleDownload} data-testid="print-download-pdf" className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper hover:bg-ink2">Download PDF</button>
        </div>
        <div id="compass-brief-print" data-testid="brief-print" className="mx-auto bg-white shadow-[0_25px_50px_rgba(0,0,0,0.25)]" style={{ width: "100%", maxWidth: "100%", color: "#1c1a17", fontFamily: "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif", lineHeight: 1.45 }}>
          {/* ===== 1. DECISION RECOMMENDATION ===== */}
          <div style={{ backgroundColor: PC.decision.bg, padding: "20px 32px" }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4C650C]">
              Prepared by Compass &middot; {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <div className="flex flex-wrap items-start justify-between gap-3 mt-1">
              <h1 className="font-serif text-[28px] font-semibold tracking-[-0.02em]">{actionTitle(top)}</h1>
              {badge && <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold", badge.cls)}><span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />{badge.text}</span>}
            </div>
            <p className="mt-3 text-[13px] leading-[1.6] text-ink">{explanation.one} {explanation.two} {explanation.three}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {impacts.map((c) => (
                <div key={c.label} className="rounded border border-[#c8dacb] bg-white px-4 py-3">
                  <p className="text-[24px] font-extrabold leading-none tracking-tight">{c.metric}</p>
                  <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.08em]">{c.label}</p>
                  <p className="mt-0.5 text-[10px] leading-[1.4] text-[#4f6280]">{c.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 2. EVIDENCE ===== */}
          <div style={{ backgroundColor: PC.evidence.bg, padding: "16px 32px" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: PC.evidence.label }}>Evidence</p>
            <p className="text-[12px] font-medium text-ink mt-0.5">{evidenceIntro(top)}</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {evidences.slice(0, 3).map((e) => (
                <div key={e.company} className="rounded bg-white px-4 py-3">
                  <p className="text-[14px] font-bold">{e.company}</p>
                  {e.context && <p className="mt-1 text-[11px] leading-[1.4] text-ink/75">{e.context}</p>}
                  <ul className="mt-1.5 space-y-1">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[11.5px] leading-[1.45] text-ink">
                        <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {evidences.length === 0 && <div className="rounded bg-white px-4 py-3 sm:col-span-3"><p className="text-[11px] italic text-[#6c685f]">Evidence is being catalogued.</p></div>}
              {evidences.length > 0 && evidences.length < 3 && (
                <div className="rounded border border-dashed border-[#bdd0f5] bg-white/50 px-4 py-3 flex items-center justify-center">
                  <p className="text-[10px] italic text-[#6c685f]">Insufficient evidence</p>
                </div>
              )}
            </div>
          </div>

          {/* ===== 3. STRATEGY AND OBJECTIVES ===== */}
          <div style={{ backgroundColor: PC.strategy.bg, padding: "16px 32px" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: PC.strategy.label }}>Strategy and Objectives</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {strategies.map((s) => (
                <div key={s.heading} className="rounded bg-white px-4 py-3">
                  <p className="text-[14px] font-bold">{s.heading}</p>
                  <p className="mt-1.5 text-[11.5px] leading-[1.45] text-ink">{s.description}</p>
                  <p className="mt-2 text-[11px] font-semibold leading-snug">Objective: {s.objective}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 4. IMPLEMENTATION ===== */}
          <div style={{ backgroundColor: PC.implementation.bg, padding: "16px 32px" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: PC.implementation.label }}>Implementation</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {steps.map((s, i) => (
                <div key={s.name} className="rounded bg-white px-4 py-3">
                  <p className="text-[14px] font-bold">Phase {i + 1}: {s.name}</p>
                  <p className="mt-1 text-[10.5px] text-[#6c685f]">Team Responsible: {s.team}</p>
                  <p className="text-[10.5px] text-[#6c685f]">Duration: {s.timeline}</p>
                  <p className="mt-1 text-[11.5px] leading-[1.45] text-ink">{s.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <span className="inline-flex rounded bg-[#1c1a17] px-4 py-2 text-[11px] font-semibold text-white">Implementation Plan</span>
              <span className="inline-flex rounded bg-[#d3ccc0] px-4 py-2 text-[11px] font-semibold text-[#6c685f]">4 Phases · Go / No-Go at pilot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

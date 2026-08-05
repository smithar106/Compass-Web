"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { groundingState, type DecisionRec } from "@/lib/decision-package";
import {
  decisionSummary, convictionKpis, businessCaseText, alternativesRejected,
  riskItems, unknownItems, assumptionItems,
  implementationRoadmap, evidenceStories, decisionNotes,
} from "@/lib/brief-text";

interface DecisionBriefPrintProps { recs: DecisionRec[]; meta: any; summary: any; status?: string; library?: number | null; onClose: () => void; }

export function DecisionBriefPrint({ recs, meta, summary, status, library, onClose }: DecisionBriefPrintProps) {
  const contentRef = useRef<HTMLDivElement>(null);
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
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const badge = g.key === "live" ? { text: "Recommended", dot: "bg-[#1E7B4C]", cls: "bg-[#E5F3EA] text-[#14532d]" } : g.key === "partial" ? { text: "Needs validation", dot: "bg-[#B45309]", cls: "bg-[#FBF0E0] text-[#7a3b06]" } : { text: "Insufficient evidence", dot: "bg-[#C4382C]", cls: "bg-[#FAE9E7] text-[#7a1f1a]" };
  const kpis = convictionKpis(top); const risks = riskItems(top); const unknowns = unknownItems(top);
  const assumptions = assumptionItems(top); const roadmap = implementationRoadmap(top); const stories = evidenceStories(top);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#101826]/70 p-4 sm:p-8" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mx-auto max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white px-5 py-3">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Executive Decision Brief</p><p className="text-[12px] font-semibold text-ink">Print preview &middot; Prepared by Compass</p></div>
          <button type="button" onClick={handleDownload} className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper hover:bg-ink2">Download PDF</button>
        </div>
        <div id="compass-brief-print" ref={contentRef} className="mx-auto bg-white px-8 py-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)] sm:px-10" style={{ width: 816, maxWidth: "100%", color: "#1c1a17", fontFamily: "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif", lineHeight: 1.5 }}>
          {/* ===== 1. EXECUTIVE RECOMMENDATION — Green ===== */}
          <PrintSection accent="#1f9d57" label="Executive Recommendation" title="What should we do?" badge={badge}>
            <p className="text-[13px] leading-[1.55] text-[#4f6280]">{decisionSummary(top, summary)}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{kpis.map((k) => (<div key={k.label} className="rounded border border-line p-3"><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#4f6280]">{k.label}</p><p className="mt-0.5 text-[20px] font-extrabold tracking-tight text-ink">{k.value}</p>{k.caption && <p className="text-[10px] text-muted">{k.caption}</p>}</div>))}</div>
          </PrintSection>

          {/* ===== 2. BUSINESS CASE — Blue ===== */}
          <PrintSection accent="#2563eb" label="Business Case" title="Why should we do it?">
            <p className="text-[13px] leading-[1.55] text-[#4f6280]">{businessCaseText(top, summary)}</p>
            {stories.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {stories.map((s) => (<div key={s.organization} className="rounded border border-line p-3"><p className="text-[13px] font-bold text-ink">{s.organization}</p><p className="mt-1 text-[11px] leading-[1.4] text-muted">{s.outcome}</p></div>))}
              </div>
            )}
            <p className="mt-3 text-[11.5px] text-muted">{alternativesRejected(top)}</p>
          </PrintSection>

          {/* ===== 3. EXECUTION PLAN — Amber ===== */}
          <PrintSection accent="#d9932a" label="Execution Plan" title="How will we do it?">
            <div className="space-y-3">
              {roadmap.map((step, i) => (<div key={step.label} className="flex items-start gap-3 rounded border border-line p-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[10px] font-bold text-muted">{i + 1}</span><div><p className="text-[12px] font-semibold text-ink">{step.label}</p><p className="mt-0.5 text-[11px] leading-[1.4] text-muted">{step.detail}</p><p className="mt-0.5 text-[10px] font-medium text-muted">Owner: {step.owner}</p></div></div>))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div><PrintSub>Risks</PrintSub>{risks.length > 0 ? <ul className="space-y-1.5">{risks.map((r,i) => <li key={i} className="text-[11px] leading-[1.4] text-muted"><b className="text-ink">{r.title}.</b> {r.mitigation}</li>)}</ul> : <p className="text-[11px] italic text-muted">None identified.</p>}</div>
              <div><PrintSub>Information needed</PrintSub>{unknowns.length > 0 ? <ul className="space-y-1.5">{unknowns.map((u) => <li key={u.title} className="text-[11px] leading-[1.4] text-muted"><b className="text-ink">{u.title}.</b> {u.why}</li>)}</ul> : <p className="text-[11px] italic text-muted">All available.</p>}</div>
              <div><PrintSub>Assumptions</PrintSub>{assumptions.length > 0 ? <ul className="space-y-1.5">{assumptions.map((a) => <li key={a.title} className="text-[11px] leading-[1.4] text-muted"><b className="text-ink">{a.title}</b></li>)}</ul> : <p className="text-[11px] italic text-muted">None identified.</p>}</div>
            </div>
          </PrintSection>

          {/* ===== 4. EVIDENCE LIBRARY — Purple ===== */}
          <PrintSection accent="#6a5acd" label="Evidence Library" title="How do we know this?">
            <p className="text-[12px] text-muted">Supporting evidence and source material backing this recommendation.</p>
            {stories.length > 0 ? (
              <div className="mt-3 space-y-2.5">
                {stories.map((s) => (<div key={s.organization} className="rounded border border-line p-3"><p className="text-[12px] font-semibold text-ink">{s.organization}</p><p className="mt-0.5 text-[10.5px] leading-[1.4] text-muted">{s.outcome}</p></div>))}
              </div>
            ) : <p className="mt-3 text-[11px] italic text-muted">No implementations catalogued yet.</p>}
            <p className="mt-3 text-[10px] italic text-muted">{decisionNotes()}</p>
          </PrintSection>

          <div className="mt-4 text-[10px] text-[#9c968a]">Prepared by Compass &middot; {today}</div>
        </div>
      </div>
    </div>
  );
}

function PrintSection({ accent, label, title, badge, children }: { accent: string; label: string; title: string; badge?: { text: string; dot: string; cls: string }; children: React.ReactNode }) {
  return (
    <div className="mb-5 break-inside-avoid">
      <div className="h-0.5 w-full mb-3" style={{ backgroundColor: accent }} />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
          <h2 className="font-serif text-[20px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
        </div>
        {badge && <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", badge.cls)}><span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />{badge.text}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function PrintSub({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">{children}</p>;
}

"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  type DecisionRec,
} from "@/lib/decision-package";
import {
  BRIEF_COLORS,
  BRIEF_TONE_STYLES,
  type BriefTone,
} from "@/lib/brief-colors";
import { buildRecommendationReasons, cleanProblem } from "@/lib/brief-text";

interface DecisionBriefPrintProps {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  library?: number | null;
  onClose: () => void;
}

export function DecisionBriefPrint({ recs, meta, summary, status, library, onClose }: DecisionBriefPrintProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const top = recs[0];

  const handleDownload = useCallback(() => {
    // Native print of the brief only. The brief lives inside a fixed modal
    // overlay, so we clone it into a static print container appended to body.
    // This gives crisp vector text, natural page flow, and no cut-off.
    const source = document.getElementById("compass-brief-print");
    if (!source) return;

    const clone = source.cloneNode(true) as HTMLElement;
    clone.id = "compass-brief-print-clone";
    clone.style.position = "static";
    clone.style.width = "100%";
    clone.style.maxWidth = "none";
    clone.style.margin = "0";
    clone.style.boxShadow = "none";
    clone.style.borderRadius = "0";

    const holder = document.createElement("div");
    holder.id = "compass-brief-print-holder";
    document.body.appendChild(holder);
    holder.appendChild(clone);

    const cleanup = () => {
      document.body.classList.remove("printing-brief");
      holder.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    document.body.classList.add("printing-brief");
    window.print();
    // Some engines do not fire afterprint reliably; keep the clone briefly.
    setTimeout(() => {
      if (document.body.contains(holder)) cleanup();
    }, 2000);
  }, []);

  if (!top) return null;

  const g = groundingState(top, meta);
  const dd = defensibilityChecks(top, summary);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const badge =
    g.key === "live"
      ? { text: "Defensible", dot: "bg-[#1E7B4C]", cls: "bg-[#E5F3EA] text-[#14532d]" }
      : g.key === "partial"
        ? { text: "Preliminary", dot: "bg-[#B45309]", cls: "bg-[#FBF0E0] text-[#7a3b06]" }
        : { text: "More evidence required", dot: "bg-[#C4382C]", cls: "bg-[#FAE9E7] text-[#7a1f1a]" };

  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const libraryLabel = library ? `${library.toLocaleString("en-US")} verified implementations` : "a growing library of verified implementations";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#101826]/70 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Executive Decision Brief preview"
      onClick={onClose}
    >
      <div className="mx-auto max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#dfe5ec] bg-white px-5 py-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Executive Decision Brief</p>
            <p className="text-[12px] font-semibold text-[#101826]">Print preview &middot; Prepared by Compass</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dfe5ec] bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Close
            </button>
          </div>
        </div>

        {/* ===== print document ===== */}
        <div
          id="compass-brief-print"
          ref={contentRef}
          className="mx-auto bg-white px-8 py-7 shadow-[0_25px_50px_rgba(0,0,0,0.25)] sm:px-10"
          style={{ width: 816, maxWidth: "100%", color: "#1c1a17", fontFamily: "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif", lineHeight: 1.5 }}
        >
          <div className="h-1.5 w-full rounded bg-gradient-to-r from-[#1f9d57] via-[#0e9db0] via-[#6a5acd] to-[#d9932a]" aria-hidden="true" />

          {/* masthead */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#1f9d57] pb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#14663a]">Executive Decision Brief</p>
              <h1 className="mt-1 font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1c1a17]">
                {top.title || "Evidence-supported intervention"}
              </h1>
              <p className="mt-0.5 text-[11.5px] text-[#6c685f]">Prepared by Compass &middot; {today}</p>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          {/* decision metadata */}
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-[#e6e2db] bg-[#e6e2db] sm:grid-cols-4">
            <PrintMeta label="Prepared for" value="Executive Leadership" />
            <PrintMeta label="Decision" value={top.category ? top.category.replace(/_/g, " ") : "Operational intervention"} />
            <PrintMeta label="Status" value={badge.text} highlight />
            <PrintMeta label="Date" value={today} />
          </div>

          {/* ============ 1. RECOMMENDATION ============ */}
          <PrintSection number="1" title="Recommendation" tone="green">
            <p className="text-[12px] font-semibold text-[#14402a]">A. You should do this</p>
            <p className="mt-1 font-serif text-[19px] font-medium leading-snug text-[#1c1a17]">
              {recommendationAction(top, summary)}
            </p>
            <div className="mt-3 space-y-2 border-t border-[#a8d6bd]/70 pt-3">
              {buildRecommendationReasons(top, summary).map((r) => (
                <p key={r.key} className="flex items-start gap-2 text-[12px] leading-[1.5] text-[#3c5645]">
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] font-bold text-[#14663a]">{r.key}.</span>
                  <span>{r.text}</span>
                </p>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
              <Kpi tone="green" label="Confidence" value={top.confidence?.label || "—"} sub={top.confidence?.score != null ? `${Math.round(top.confidence.score * 100)}%` : ""} />
              <Kpi tone="teal" label="Evidence" value={String(total)} sub={`${orgs} organizations`} />
              <Kpi tone="amber" label="Timeline" value={timelineText(top)} sub="estimate" />
              <Kpi tone="violet" label="Readiness" value={(top.information_gaps || []).length ? "Needs baseline" : "Ready"} sub={(top.information_gaps || []).length ? `${(top.information_gaps || []).length} gap(s) to close` : "context complete"} />
            </div>
          </PrintSection>

          {/* ============ 2. EVIDENCE ============ */}
          <PrintSection number="2" title="Evidence" tone="teal">
            <Sub label="Comparable implementations" tone="teal" />
            {(top.comparable_implementations || []).slice(0, 3).length > 0 ? (
              <ul className="mt-1.5 space-y-1.5">
                {(top.comparable_implementations || []).slice(0, 3).map((c) => (
                  <li key={c.record_id || c.organization} className="flex items-start justify-between gap-3 rounded border border-[#a9dce2]/70 bg-white/60 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-[#0a3a42]">{c.organization || "Verified implementation"}</p>
                      <p className="text-[11px] leading-[1.4] text-[#0a6a78]/85">{c.outcome_summary || c.observed_outcome || "Not quantified"}</p>
                    </div>
                    <span className="shrink-0 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0a6a78]">
                      {c.evidence_tier || "unknown"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11.5px] italic text-[#0a6a78]/70">No comparable implementations attached.</p>
            )}

            <Sub label="Defensibility" tone="teal" />
            <p className="text-[11.5px] text-[#0a6a78]/85">{dd.score} of {dd.total} questions answered from evidence.</p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-1.5">
              {dd.checks.map((c) => (
                <div key={c.key} className="flex items-start gap-2">
                  <span className={cn("mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white", c.ok ? "bg-[#1f9d57]" : "bg-[#B45309]")} aria-hidden="true">
                    {c.ok ? "✓" : "⚠"}
                  </span>
                  <p className="text-[11.5px] font-medium text-[#1c1a17]">{c.label}</p>
                </div>
              ))}
            </div>

            <Sub label="Alternatives considered" tone="teal" />
            {(top.alternatives_considered || []).slice(0, 3).length > 0 ? (
              <ul className="mt-1.5 space-y-1.5">
                {(top.alternatives_considered || []).slice(0, 3).map((a) => (
                  <li key={a.family} className="flex items-start gap-2 text-[11.5px] leading-[1.45] text-[#1c1a17]/85">
                    <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#0a6a78] text-[8px] font-bold text-white" aria-hidden="true">×</span>
                    <p><b className="text-[#0a6a78]">{a.family}.</b> {a.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11.5px] italic text-[#0a6a78]/70">No alternatives surfaced.</p>
            )}

            <p className="mt-3 border-t border-[#a9dce2]/50 pt-2 text-[10.5px] text-[#0a6a78]/80">
              Compared against {libraryLabel}. Every material claim traces to a source; Compass defers when evidence is insufficient.
            </p>
          </PrintSection>

          {/* ============ 3. NEXT STEPS ============ */}
          <PrintSection number="3" title="Next Steps" tone="amber">
            <Sub label="Validate before scaling" tone="amber" />
            {top.next_validation_step ? (
              <div className="rounded border border-[#e8cf9c] bg-white/60 p-3 print-avoid-break">
                <p className="text-[12.5px] font-bold text-[#8f5c11]">{top.next_validation_step.action}</p>
                <p className="mt-0.5 text-[11.5px] leading-[1.5] text-[#5c5240]">{top.next_validation_step.success_criteria || top.next_validation_step.purpose}</p>
              </div>
            ) : (
              <p className="text-[11.5px] italic text-[#8f5c11]">No validation step defined.</p>
            )}

            <Sub label="Risks & assumptions" tone="amber" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                {(top.risks || []).slice(0, 3).length > 0 ? (
                  <ul className="space-y-1.5">
                    {(top.risks || []).slice(0, 3).map((r, i) => (
                      <li key={i} className="text-[11.5px] leading-[1.45] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{r.title}.</b> {r.mitigation ? <span className="text-[#14663a]">Mitigation: {r.mitigation}</span> : r.explanation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11.5px] italic text-[#8f5c11]">No risks surfaced.</p>
                )}
              </div>
              <div>
                {(top.assumptions_detail || []).slice(0, 3).length > 0 ? (
                  <ul className="space-y-1.5">
                    {(top.assumptions_detail || []).slice(0, 3).map((a, i) => (
                      <li key={i} className="text-[11.5px] leading-[1.45] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{a.title}.</b> {a.explanation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11.5px] italic text-[#8f5c11]">No assumptions recorded.</p>
                )}
              </div>
            </div>

            <Sub label="Measure the outcome" tone="amber" />
            <p className="text-[11.5px] leading-[1.5] text-[#5c5240]">
              Define the baseline, execute the plan with your team or a selected partner, and report
              against the success criteria above. Compass tracks the outcome and feeds it into future
              decisions.
            </p>
          </PrintSection>

          <p className="mt-5 border-t border-[#e6e2db] pt-2.5 text-[10.5px] leading-[1.5] text-[#9c968a]">
            Grounding note: {g.note} Figures and ranges shown are derived from retrieved implementation evidence and are not outcome guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}

function recommendationAction(top: DecisionRec, summary: any): string {
  const problem = cleanProblem(summary?.problem_statement);
  const title = top.title || "the recommended intervention";
  if (problem && top.title) {
    return `${title} for ${problem}`;
  }
  return title;
}

function PrintMeta({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("bg-white px-4 py-3", highlight && "bg-[#e9f6ee]")}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6c685f]">{label}</p>
      <p className={cn("mt-0.5 text-[13px] font-semibold text-[#1c1a17]", highlight && "text-[#14663a]")}>{value}</p>
    </div>
  );
}

function PrintSection({ number, title, tone, children }: { number: string; title: string; tone: BriefTone; children: React.ReactNode }) {
  const c = BRIEF_COLORS[tone];
  const t = BRIEF_TONE_STYLES[tone];
  return (
    <section className="mt-6">
      <div className="mb-2.5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold text-white"
          style={{ backgroundColor: c.accent }}
        >
          {number}
        </span>
        <h2 className={cn("font-serif text-[20px] font-semibold tracking-[-0.01em]", t.label)}>{title}</h2>
        <span aria-hidden="true" className="h-px flex-1" style={{ backgroundColor: c.accent + "40" }} />
      </div>
      <div className={cn("rounded-lg border p-4", t.card)}>{children}</div>
    </section>
  );
}

function Sub({ label, tone }: { label: string; tone: BriefTone }) {
  const c = BRIEF_COLORS[tone];
  return (
    <p className="mt-4 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] first:mt-0 print-avoid-break" style={{ color: c.ink }}>
      <span aria-hidden="true" className="h-1 w-3 rounded-full" style={{ backgroundColor: c.accent }} />
      {label}
    </p>
  );
}

function Kpi({ tone = "neutral", label, value, sub }: { tone?: BriefTone; label: string; value: string; sub?: string }) {
  const c = BRIEF_COLORS[tone];
  const t = BRIEF_TONE_STYLES[tone];
  return (
    <div className={cn("rounded border p-3 print-avoid-break", t.card)}>
      <p className={cn("text-[9px] font-bold uppercase tracking-[0.1em]", t.label)}>{label}</p>
      <p className="mt-0.5 truncate text-[18px] font-extrabold tracking-tight" style={{ color: c.ink }}>{value}</p>
      {sub && <p className={cn("truncate text-[10px]", t.label)}>{sub}</p>}
    </div>
  );
}

function timelineText(top: DecisionRec): string {
  const tl = top.impact?.implementation_timeline;
  const lo = tl?.min_weeks, hi = tl?.max_weeks;
  if (!lo && !hi) return "TBD";
  const weeks = hi || lo || 0;
  if (weeks > 8) {
    const mo = Math.max(1, Math.round(weeks / 4.33));
    return lo && hi ? `${Math.max(1, Math.round(lo / 4.33))}–${Math.round(hi / 4.33)} months` : `~${mo} months`;
  }
  return lo && hi ? `${lo}–${hi} weeks` : `${lo || hi} weeks`;
}

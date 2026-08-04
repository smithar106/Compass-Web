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
import {
  buildExecutiveSummary,
  buildWhyCards,
  buildImpactKpis,
  buildConfidenceExplanation,
  buildRiskItems,
  buildUnknownItems,
  buildAssumptionItems,
  defensibilitySummary,
} from "@/lib/brief-text";

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
  const [exporting, setExporting] = useState(false);
  const top = recs[0];

  const handleDownload = useCallback(() => {
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
      ? { text: "Recommended", dot: "bg-[#1E7B4C]", cls: "bg-[#E5F3EA] text-[#14532d]" }
      : g.key === "partial"
        ? { text: "Needs validation", dot: "bg-[#B45309]", cls: "bg-[#FBF0E0] text-[#7a3b06]" }
        : { text: "Insufficient evidence", dot: "bg-[#C4382C]", cls: "bg-[#FAE9E7] text-[#7a1f1a]" };

  const whyCards = buildWhyCards(top, summary);
  const impactKpis = buildImpactKpis(top);
  const confidenceFactors = buildConfidenceExplanation(top);
  const risks = buildRiskItems(top);
  const unknowns = buildUnknownItems(top);
  const assumptions = buildAssumptionItems(top);
  const defSummary = defensibilitySummary(dd.checks);

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
              <h1 className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1c1a17]">
                Executive Decision Brief
              </h1>
              <p className="mt-0.5 text-[11.5px] text-[#6c685f]">Prepared by Compass &middot; {today}</p>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-[#e6e2db] bg-[#e6e2db] sm:grid-cols-4">
            <PrintMeta label="Prepared for" value="Executive Leadership" />
            <PrintMeta label="Decision" value={top.category ? top.category.replace(/_/g, " ") : "Operational intervention"} />
            <PrintMeta label="Status" value={badge.text} highlight />
            <PrintMeta label="Date" value={today} />
          </div>

          <p className="mt-4 text-[13px] leading-[1.55] text-[#6c685f]">
            {buildExecutiveSummary(top, meta, library ?? null)}
          </p>

          {/* ===== 1. WHY THIS IS THE BEST DECISION ===== */}
          <PrintSection number="1" title="Why this is the best decision" tone="green">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {whyCards.map((card) => (
                <div key={card.title} className="rounded border border-[#a8d6bd] bg-white/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#14663a]">{card.title}</p>
                  <ul className="mt-1.5 space-y-1">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-[11px] leading-[1.4] text-[#3c5645]">
                        <span aria-hidden="true" className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#1f9d57]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </PrintSection>

          {/* ===== 2. EXPECTED BUSINESS IMPACT ===== */}
          <PrintSection number="2" title="Expected business impact" tone="teal">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {impactKpis.map((k) => (
                <div key={k.label} className="rounded border border-[#a9dce2] bg-white/50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#0a6a78]">{k.label}</p>
                  <p className="mt-0.5 text-[18px] font-extrabold tracking-tight text-[#0a3a42]">{k.value}</p>
                  <p className="text-[10px] text-[#0a6a78]/80">{k.caption}</p>
                </div>
              ))}
            </div>

            <Sub label="Why this confidence level" tone="teal" />
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {confidenceFactors.map((f) => (
                <li key={f.label} className="flex items-start gap-2 text-[11px]">
                  <span className={cn("mt-[5px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white", f.present ? "bg-[#1f9d57]" : "bg-[#B45309]")} aria-hidden="true">
                    {f.present ? "✓" : "⚠"}
                  </span>
                  <span className={cn("leading-[1.4]", f.present ? "text-[#1c1a17]/85" : "text-[#B45309]")}>{f.label}</span>
                </li>
              ))}
            </ul>
          </PrintSection>

          {/* ===== 3. WHAT COULD GO WRONG ===== */}
          <PrintSection number="3" title="What could go wrong" tone="amber">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Sub label="Risks" tone="amber" />
                {risks.length > 0 ? (
                  <ul className="space-y-1.5">
                    {risks.slice(0, 3).map((r, i) => (
                      <li key={i} className="text-[11px] leading-[1.4] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{r.title}.</b> {r.mitigation ? `Mitigation: ${r.mitigation}` : r.explanation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#8f5c11]">No implementation risks identified.</p>
                )}
              </div>
              <div>
                <Sub label="Unknowns" tone="amber" />
                {unknowns.length > 0 ? (
                  <ul className="space-y-1.5">
                    {unknowns.map((u) => (
                      <li key={u.title} className="text-[11px] leading-[1.4] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{u.title}.</b> {u.why}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#8f5c11]">No unknowns to flag.</p>
                )}
              </div>
              <div>
                <Sub label="Assumptions" tone="amber" />
                {assumptions.length > 0 ? (
                  <ul className="space-y-1.5">
                    {assumptions.map((a) => (
                      <li key={a.title} className="text-[11px] leading-[1.4] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{a.title}.</b> {a.explanation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#8f5c11]">No material assumptions identified.</p>
                )}
              </div>
            </div>
          </PrintSection>

          {/* ===== 4. HOW WE EXECUTE ===== */}
          <PrintSection number="4" title="How we execute" tone="teal">
            <Sub label="Implementation path" tone="teal" />
            <div className="grid grid-cols-2 gap-2">
              {["Internal team", "Selected partner"].map((opt) => (
                <div key={opt} className="rounded border border-[#a9dce2] bg-white/60 px-3 py-2 text-[12px] font-semibold text-[#0a3a42]">{opt}</div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-[#0a6a78]/80">
              Compass does not implement. Your team or a selected partner executes the plan.
            </p>

            <Sub label="Comparable implementations" tone="teal" />
            {(top.comparable_implementations || []).slice(0, 3).length > 0 ? (
              <ul className="space-y-1.5">
                {(top.comparable_implementations || []).slice(0, 3).map((c) => (
                  <li key={c.record_id || c.organization} className="rounded border border-[#a9dce2]/70 bg-white/60 px-3 py-2">
                    <p className="text-[12px] font-bold text-[#0a3a42]">{c.organization || "Verified implementation"}</p>
                    <p className="text-[10.5px] leading-[1.4] text-[#0a6a78]/85">{(c.outcome_summary || c.observed_outcome || "Outcome not quantified").replace(/;/g, " · ")}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] italic text-[#0a6a78]/70">No comparable implementations attached.</p>
            )}

            {top.next_validation_step && (
              <>
                <Sub label="Validation before scaling" tone="teal" />
                <div className="rounded border border-[#a9dce2] bg-white/60 p-3 print-avoid-break">
                  <p className="text-[12px] font-bold text-[#0a3a42]">{top.next_validation_step.action}</p>
                  <p className="mt-0.5 text-[11px] leading-[1.4] text-[#0a6a78]/80">{top.next_validation_step.success_criteria || top.next_validation_step.purpose}</p>
                </div>
              </>
            )}
          </PrintSection>

          {/* ===== 5. OTHER APPROACHES + DEFENSIBILITY ===== */}
          <PrintSection number="5" title="Other approaches evaluated" tone="violet">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                {(top.alternatives_considered || []).slice(0, 3).length > 0 ? (
                  <ul className="space-y-1.5">
                    {(top.alternatives_considered || []).slice(0, 3).map((a) => (
                      <li key={a.family} className="rounded border border-[#c5bef0] bg-white/50 p-2">
                        <p className="text-[12px] font-semibold text-[#2c2a45]">{a.family}</p>
                        <p className="mt-0.5 text-[10.5px] leading-[1.4] text-[#463a9e]/80">{a.reason}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#463a9e]/70">No alternatives were surfaced.</p>
                )}
              </div>
              <div>
                <Sub label="Why we can defend this decision" tone="violet" />
                <ul className="space-y-1.5">
                  {defSummary.map((f) => (
                    <li key={f.label} className="flex items-start gap-2 text-[11px]">
                      <span className={cn("mt-[5px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white", f.ok ? "bg-[#1f9d57]" : "bg-[#B45309]")} aria-hidden="true">
                        {f.ok ? "✓" : "⚠"}
                      </span>
                      <span className={cn("leading-[1.4]", f.ok ? "text-[#1c1a17]/85" : "text-[#B45309]")}>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PrintSection>

          <p className="mt-5 border-t border-[#e6e2db] pt-2.5 text-[10.5px] leading-[1.5] text-[#9c968a]">
            Grounding note: {g.note} Figures and ranges shown are derived from retrieved implementation evidence and are not outcome guarantees.
          </p>
        </div>
      </div>
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

function PrintMeta({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("bg-white px-4 py-3", highlight && "bg-[#e9f6ee]")}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6c685f]">{label}</p>
      <p className={cn("mt-0.5 text-[13px] font-semibold text-[#1c1a17]", highlight && "text-[#14663a]")}>{value}</p>
    </div>
  );
}

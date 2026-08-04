"use client";

import { useCallback, useRef } from "react";
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
  businessSummary,
  executiveKpis,
  businessRationale,
  riskItems,
  unknownItems,
  assumptionItems,
  implementationRoadmap,
  evidenceStories,
  evaluatedOptions,
  decisionNotes,
  defensibilityItems,
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
    setTimeout(() => { if (document.body.contains(holder)) cleanup(); }, 2000);
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

  const kpis = executiveKpis(top);
  const rationale = businessRationale(top, summary);
  const risks = riskItems(top);
  const unknowns = unknownItems(top);
  const assumptions = assumptionItems(top);
  const roadmap = implementationRoadmap(top);
  const stories = evidenceStories(top);
  const options = evaluatedOptions(top);
  const defItems = defensibilityItems(dd.checks);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#101826]/70 p-4 sm:p-8"
      role="dialog" aria-modal="true" aria-label="Executive Decision Brief preview"
      onClick={onClose}
    >
      <div className="mx-auto max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#dfe5ec] bg-white px-5 py-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Executive Decision Brief</p>
            <p className="text-[12px] font-semibold text-[#101826]">Print preview &middot; Prepared by Compass</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink2">
              Download PDF
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-[#dfe5ec] bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40">
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

          {/* ===== SECTION 1: EXECUTIVE SUMMARY ===== */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#1f9d57] pb-3">
            <div>
              <h1 className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1c1a17]">Executive Decision Brief</h1>
              <p className="mt-0.5 font-serif text-[17px] font-medium leading-snug text-[#14402a]">
                Implement {top.title || "the recommended intervention"}{summary?.problem_statement ? ` for ${summary.problem_statement.replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim()}` : ""}.
              </p>
              <p className="mt-0.5 text-[11.5px] text-[#6c685f]">Prepared by Compass &middot; {today}</p>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          <p className="mt-4 text-[13px] leading-[1.55] text-[#6c685f]">
            {businessSummary(top, meta, library ?? null)}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded border border-[#a9dce2] bg-[#e5f6f8] p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#0a6a78]">{k.label}</p>
                <p className="mt-0.5 text-[20px] font-extrabold tracking-tight text-[#0a3a42]">{k.value}</p>
                {k.caption && <p className="text-[10px] text-[#0a6a78]/80">{k.caption}</p>}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-[#e6e2db] bg-[#e6e2db] sm:grid-cols-4">
            <PrintMeta label="Prepared for" value="Executive Leadership" />
            <PrintMeta label="Decision" value={top.category ? top.category.replace(/_/g, " ") : "Operational intervention"} />
            <PrintMeta label="Status" value={badge.text} highlight />
            <PrintMeta label="Date" value={today} />
          </div>

          {/* ===== SECTION 2: WHY THIS IS THE RIGHT DECISION ===== */}
          <PrintSection number="1" title="Why this is the right decision" tone="green">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {rationale.map((card) => (
                <div key={card.title} className="rounded border border-[#a8d6bd] bg-white/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#14663a]">{card.title}</p>
                  <p className="mt-1.5 text-[11px] leading-[1.4] text-[#3c5645]">{card.body}</p>
                </div>
              ))}
            </div>
          </PrintSection>

          {/* ===== SECTION 3: RISKS AND UNKNOWNS ===== */}
          <PrintSection number="2" title="Risks and unknowns" tone="amber">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Sub label="Known risks" tone="amber" />
                {risks.length > 0 ? (
                  <ul className="space-y-1.5">
                    {risks.map((r, i) => (
                      <li key={i} className="text-[11px] leading-[1.4] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{r.title}.</b> {r.mitigation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#8f5c11]">No material risks identified.</p>
                )}
              </div>
              <div>
                <Sub label="Information needed" tone="amber" />
                {unknowns.length > 0 ? (
                  <ul className="space-y-1.5">
                    {unknowns.map((u) => (
                      <li key={u.title} className="text-[11px] leading-[1.4] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{u.title}.</b> {u.why}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#8f5c11]">All necessary information is available.</p>
                )}
              </div>
              <div>
                <Sub label="Assumptions" tone="amber" />
                {assumptions.length > 0 ? (
                  <ul className="space-y-1.5">
                    {assumptions.map((a) => (
                      <li key={a.title} className="text-[11px] leading-[1.4] text-[#5c5240]">
                        <b className="text-[#8f5c11]">{a.title}</b>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#8f5c11]">No material assumptions identified.</p>
                )}
              </div>
            </div>
          </PrintSection>

          {/* ===== SECTION 4: IMPLEMENTATION ===== */}
          <PrintSection number="3" title="Implementation" tone="teal">
            {roadmap.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3 rounded border border-[#a9dce2] bg-white/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0e9db0] font-mono text-[10px] font-bold text-[#0a6a78]">{i + 1}</span>
                <div>
                  <p className="text-[12px] font-semibold text-[#0a3a42]">{step.label}</p>
                  <p className="mt-0.5 text-[11px] leading-[1.4] text-[#0a6a78]/80">{step.detail}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#0a6a78]">Owner: {step.owner}</p>
                </div>
              </div>
            ))}
            <p className="mt-2 text-[11px] text-[#0a6a78]/80">
              Compass does not implement. Your team or a selected partner executes the plan.
            </p>
          </PrintSection>

          {/* ===== SECTION 5: EVIDENCE ===== */}
          <PrintSection number="4" title="Evidence" tone="teal">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stories.map((s) => (
                <div key={s.organization} className="rounded border border-[#a9dce2] bg-white/60 p-3">
                  <p className="text-[12px] font-bold text-[#0a3a42]">{s.organization}</p>
                  <p className="mt-1.5 text-[10px] leading-[1.4] text-[#0a6a78]/85">
                    <b>Challenge:</b> {s.challenge}<br />
                    <b>Solution:</b> {s.solution}<br />
                    <b>Result:</b> {s.result}
                  </p>
                </div>
              ))}
              {stories.length === 0 && (
                <p className="italic text-[#0a6a78]/70 sm:col-span-3">No comparable cases were attached.</p>
              )}
            </div>
          </PrintSection>

          {/* ===== SECTION 6: OTHER OPTIONS CONSIDERED + DEFENSIBILITY ===== */}
          <PrintSection number="5" title="Other options considered" tone="violet">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                {options.length > 0 ? (
                  <ul className="space-y-2">
                    {options.map((o) => (
                      <li key={o.title} className="rounded border border-[#c5bef0] bg-white/50 p-2">
                        <p className="text-[12px] font-semibold text-[#2c2a45]">{o.title}</p>
                        <p className="mt-0.5 text-[10.5px] leading-[1.4] text-[#463a9e]/80">{o.tradeoff}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] italic text-[#463a9e]/70">No alternatives surfaced.</p>
                )}
              </div>
              <div>
                <Sub label="Why we can defend this" tone="violet" />
                <ul className="space-y-1.5">
                  {defItems.map((f) => (
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

          {/* ===== DECISION NOTES ===== */}
          <div className="mt-5 border-t border-[#e6e2db] pt-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9c968a]">Decision Notes</p>
            <p className="mt-1 text-[10.5px] leading-[1.5] text-[#9c968a]">
              {decisionNotes(g)}
            </p>
          </div>
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
        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold text-white" style={{ backgroundColor: c.accent }}>
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

"use client";

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

/* ------------------------------------------------------------------ */
/*  Cream + teal brief identity                                       */
/* ------------------------------------------------------------------ */

const BRIEF = {
  bg: "#F4EEE1",
  card: "#FCFAF3",
  border: "#E4DBC7",
  accent: "#0E7C8C",
  accentLine: "rgba(14,124,140,0.32)",
  accentSoft: "rgba(14,124,140,0.09)",
  text: "#14203A",
  muted: "#5A6072",
  faint: "#8C8776",
} as const;

interface DecisionMemoProps {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  onImplement?: () => void;
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div
      className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.16em]"
      style={{ color: BRIEF.accent }}
    >
      <span aria-hidden="true" className="inline-block h-px w-[26px]" style={{ backgroundColor: BRIEF.accent }} />
      {children}
    </div>
  );
}

export function DecisionMemo({ recs, meta, summary, status, onImplement }: DecisionMemoProps) {
  const top = recs[0];
  if (!top) return null;

  const g = groundingState(top, meta);
  const badgeText =
    g.key === "live"
      ? "Recommended for Pilot Approval"
      : g.key === "partial"
        ? "Recommended – Pilot Before Scale"
        : "Insufficient evidence";

  const explanation = recommendationExplanation(top, summary);
  const impacts = impactCards(top);
  const evidences = evidenceCards(top, summary);
  const strategies = strategyCards(top);
  const steps = implementationSteps(top);

  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: BRIEF.bg, color: BRIEF.text }}>
      {/* ===== Left rail ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 top-0 z-0 hidden sm:block"
        style={{ left: 48, width: 1, background: `linear-gradient(to bottom, transparent, ${BRIEF.accentLine} 12%, ${BRIEF.accentLine} 88%, transparent)` }}
      />

      <div className="relative z-[1] mx-auto max-w-[1040px] px-5 pb-[100px] pt-6 sm:pl-[96px] sm:pr-10 sm:pt-7">

        {/* ===== Masthead ===== */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-y-2 pb-5" style={{ backgroundColor: BRIEF.bg }}>
          <div className="flex items-center gap-[11px] text-[14px] font-semibold uppercase tracking-[0.18em]">
            <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rounded-full" style={{ backgroundColor: BRIEF.accent }} />
            Compass
          </div>
          <div className="font-mono text-[11px] uppercase leading-[1.7] tracking-[0.14em]" style={{ color: BRIEF.muted }}>
            Executive Decision Brief<br />
            Prepared for Leadership &middot; {date}
          </div>
        </div>

        {/* ======================================================================== */}
        {/*  01 — Decision Recommendation                                           */}
        {/* ======================================================================== */}
        <section data-testid="section-decision" className="py-[60px]" style={{ borderTop: `1px solid ${BRIEF.border}` }}>
          <Eyebrow>01 — Decision Recommendation</Eyebrow>

          <h1
            data-testid="decision-title"
            className="mb-[26px] mt-0 max-w-[20ch] text-[clamp(2rem,5vw,3.35rem)] font-normal leading-[1.08] tracking-[-0.025em]"
            style={{ color: BRIEF.text }}
          >
            {actionTitle(top)}
          </h1>

          <div className="mb-6 max-w-[62ch] space-y-4 text-[1.12rem] leading-[1.6]" style={{ color: BRIEF.text }}>
            <p className="m-0">{explanation.one}</p>
            <p className="m-0">{explanation.two}</p>
            <p className="m-0">{explanation.three}</p>
          </div>

          {/* ---- KPI cards ---- */}
          <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {impacts.map((c) => (
              <div
                key={c.label}
                data-testid="impact-card"
                className="relative overflow-hidden px-6 pb-6 pt-[26px]"
                style={{
                  backgroundColor: BRIEF.card,
                  border: `1px solid ${BRIEF.border}`,
                  borderRadius: 10,
                }}
              >
                {/* top accent bar */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[2px] w-full opacity-70"
                  style={{ background: `linear-gradient(90deg, ${BRIEF.accent}, transparent 70%)` }}
                />
                <p
                  className="mb-[14px] font-mono text-[11px] uppercase leading-none tracking-[0.14em]"
                  style={{ color: BRIEF.muted }}
                >
                  {c.label}
                </p>
                <p
                  className="text-[clamp(2.4rem,5vw,3.1rem)] font-light leading-none tracking-[-0.03em]"
                  style={{ color: BRIEF.text, fontVariantNumeric: "tabular-nums" }}
                >
                  {c.metric}
                </p>
                {c.context && (
                  <p className="mt-3 text-[0.92rem] leading-[1.5]" style={{ color: BRIEF.muted }}>
                    {c.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================================== */}
        {/*  02 — Evidence                                                          */}
        {/* ======================================================================== */}
        <section data-testid="section-evidence" className="py-[60px]" style={{ borderTop: `1px solid ${BRIEF.border}` }}>
          <Eyebrow>02 — Evidence</Eyebrow>
          <h2 className="mb-[14px] mt-0 text-[clamp(1.6rem,3.4vw,2.3rem)] font-normal leading-[1.12] tracking-[-0.02em]" style={{ color: BRIEF.text }}>
            What happened when others implemented this approach
          </h2>
          <p className="mb-0 max-w-[62ch] text-[0.95rem] leading-[1.6]" style={{ color: BRIEF.muted }}>
            {evidenceIntro(top)}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {evidences.map((e, i) => (
              <div
                key={e.company}
                data-testid="evidence-card"
                className="flex flex-col gap-[14px] p-[26px_24px] transition-colors"
                style={{
                  backgroundColor: BRIEF.card,
                  border: `1px solid ${BRIEF.border}`,
                  borderRadius: 10,
                }}
              >
                <p
                  className="text-[1.18rem] font-semibold leading-snug tracking-[-0.01em]"
                  style={{ color: BRIEF.text }}
                >
                  {e.company}
                </p>
                {e.isSupporting && (
                  <span className="mt-[-8px] font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: BRIEF.faint }}>
                    Supporting evidence
                  </span>
                )}
                {e.context && (
                  <p className="m-0 text-[0.95rem] leading-[1.5]" style={{ color: BRIEF.muted }}>
                    {e.context}
                  </p>
                )}
                <div className="mt-auto" style={{ borderTop: `1px solid ${BRIEF.border}`, paddingTop: 16 }}>
                  {e.bullets.map((b) => (
                    <p
                      key={b}
                      className="m-0 text-[1.02rem] font-semibold leading-snug tracking-[-0.01em]"
                      style={{ color: BRIEF.accent }}
                    >
                      {b}
                    </p>
                  ))}
                  {e.bullets.length > 0 && (
                    <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: BRIEF.muted }}>
                      {e.isSupporting ? "Supporting outcome" : "Observed outcome"}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {evidences.length === 0 && (
              <div
                className="col-span-full p-[26px_24px]"
                style={{ backgroundColor: BRIEF.card, border: `1px solid ${BRIEF.border}`, borderRadius: 10, color: BRIEF.muted }}
              >
                <p className="m-0 text-[0.95rem] leading-[1.6]">
                  Directly comparable evidence is currently limited. Compass found supporting evidence for the broader implementation pattern, but not enough directly comparable deployments to display as primary evidence.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================================== */}
        {/*  03 — Strategy &amp; Objectives                                          */}
        {/* ======================================================================== */}
        <section data-testid="section-strategy" className="py-[60px]" style={{ borderTop: `1px solid ${BRIEF.border}` }}>
          <Eyebrow>03 — Strategy &amp; Objectives</Eyebrow>
          <h2 className="mb-[14px] mt-0 text-[clamp(1.6rem,3.4vw,2.3rem)] font-normal leading-[1.12] tracking-[-0.02em]" style={{ color: BRIEF.text }}>
            What this decision is designed to achieve
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {strategies.map((s) => (
              <div
                key={s.heading}
                data-testid="strategy-card"
                className="p-[28px_24px]"
                style={{
                  backgroundColor: BRIEF.card,
                  border: `1px solid ${BRIEF.border}`,
                  borderRadius: 10,
                }}
              >
                <p className="mb-5 text-[1.18rem] font-semibold leading-snug tracking-[-0.01em]" style={{ color: BRIEF.text }}>
                  {s.heading}
                </p>
                <div className="mb-4">
                  <p className="mb-[5px] font-mono text-[10.5px] uppercase tracking-[0.13em]" style={{ color: BRIEF.accent }}>
                    Strategy
                  </p>
                  <p className="m-0 text-[0.94rem] leading-[1.5]" style={{ color: BRIEF.muted }}>
                    {s.description}
                  </p>
                </div>
                <div>
                  <p className="mb-[5px] font-mono text-[10.5px] uppercase tracking-[0.13em]" style={{ color: BRIEF.accent }}>
                    Business Objective
                  </p>
                  <p className="m-0 text-[0.94rem] leading-[1.5]" style={{ color: BRIEF.muted }}>
                    {s.objective}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================================== */}
        {/*  04 — Implementation                                                     */}
        {/* ======================================================================== */}
        <section data-testid="section-implementation" className="py-[60px]" style={{ borderTop: `1px solid ${BRIEF.border}` }}>
          <Eyebrow>04 — Implementation</Eyebrow>
          <h2 className="mb-[14px] mt-0 text-[clamp(1.6rem,3.4vw,2.3rem)] font-normal leading-[1.12] tracking-[-0.02em]" style={{ color: BRIEF.text }}>
            A phased path from approval to scale
          </h2>

          <div className="mt-10 flex flex-col">
            {steps.map((s, i) => (
              <div
                key={s.name}
                data-testid="implementation-step"
                className="grid grid-cols-[44px_1fr] gap-x-6 gap-y-0 py-7"
                style={{ borderTop: i > 0 ? `1px solid ${BRIEF.border}` : "none" }}
              >
                <span className="pt-[3px] font-mono text-[13px] font-semibold" style={{ color: BRIEF.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="text-[1.2rem] font-semibold leading-snug tracking-[-0.01em]" style={{ color: BRIEF.text }}>
                      {s.name}
                    </span>
                    <span
                      className="inline-block rounded-full border px-[11px] py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]"
                      style={{
                        color: BRIEF.accent,
                        borderColor: BRIEF.accentLine,
                        backgroundColor: BRIEF.accentSoft,
                      }}
                    >
                      {s.timeline}
                    </span>
                    <span
                      className="inline-block rounded-full border px-[11px] py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]"
                      style={{ color: BRIEF.muted, borderColor: BRIEF.border }}
                    >
                      {s.team}
                    </span>
                  </div>
                  <p className="m-0 max-w-[68ch] text-[0.96rem] leading-[1.55]" style={{ color: BRIEF.muted }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ---- CTAs ---- */}
          <div className="mt-[52px] flex flex-wrap gap-[14px]">
            {onImplement && (
              <button
                type="button"
                onClick={onImplement}
                className="inline-flex cursor-pointer items-center gap-[10px] rounded-[9px] px-[26px] py-[15px] text-[0.95rem] font-semibold tracking-[0.01em] transition-all duration-[0.18s] hover:opacity-90"
                style={{ backgroundColor: BRIEF.accent, color: "#FBF8F0", border: "1px solid transparent" }}
              >
                Approve &amp; Launch Pilot →
              </button>
            )}
            <span
              className="inline-flex cursor-pointer items-center gap-[10px] rounded-[9px] px-[26px] py-[15px] text-[0.95rem] font-semibold tracking-[0.01em] transition-all duration-[0.18s]"
              style={{ backgroundColor: "#1c1a17", color: "#FBF8F0", border: "1px solid transparent" }}
              data-testid="download-pdf-label"
            >
              Download Brief as PDF
            </span>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="mt-16 flex flex-wrap justify-between gap-[10px] border-t pt-[22px] font-mono text-[11px] uppercase tracking-[0.1em]" style={{ borderTopColor: BRIEF.border, color: BRIEF.faint }}>
          <span>Compass &middot; Executive Decision Brief</span>
          <span>Recommend. Decide. Implement. Measure.</span>
        </footer>

      </div>
    </div>
  );
}

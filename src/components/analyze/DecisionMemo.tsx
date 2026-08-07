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
import { BRIEF_COLORS, type BriefTone } from "@/lib/brief-colors";

interface DecisionMemoProps {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
}

const TONES: Record<"purpose" | "evidence" | "objectives" | "next", (typeof BRIEF_COLORS)[BriefTone]> = {
  purpose: BRIEF_COLORS.green,
  evidence: BRIEF_COLORS.teal,
  objectives: BRIEF_COLORS.amber,
  next: BRIEF_COLORS.violet,
};

const BADGE_BY_KEY: Record<string, { text: string; dot: string; cls: string; ink: string }> = {
  live: {
    text: "Recommended for Pilot Approval",
    dot: "bg-[#1E7B4C]",
    cls: "bg-[#E5F3EA] text-[#14532d] border-[#BFDCC9]",
    ink: "#14663a",
  },
  partial: {
    text: "Recommended – Pilot Before Scale",
    dot: "bg-[#B45309]",
    cls: "bg-[#FBF0E0] text-[#7a3b06] border-[#E8CF9C]",
    ink: "#7a3b06",
  },
  insufficient: {
    text: "Insufficient evidence",
    dot: "bg-[#C4382C]",
    cls: "bg-[#FAE9E7] text-[#7a1f1a] border-[#E5B7B0]",
    ink: "#7a1f1a",
  },
};

function SectionHead({ number, title, tone }: { number: string; title: string; tone: (typeof BRIEF_COLORS)[BriefTone] }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[13px] font-bold text-white"
        style={{ backgroundColor: tone.ink }}
      >
        {number}
      </span>
      <h2 className="font-serif text-[21px] font-semibold leading-tight tracking-[-0.01em] text-[#1c1a17]">{title}</h2>
      <span className="h-px min-w-6 flex-1" style={{ backgroundColor: "rgba(28,26,23,0.14)" }} />
    </div>
  );
}

function MetaCell({ label, value, hl, hlColor }: { label: string; value: string; hl?: boolean; hlColor?: string }) {
  return (
    <div className={cn("min-w-0 bg-white px-4 py-3", hl && "bg-[#E5F3EA]")}>
      <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#6c685f]">{label}</p>
      <p
        className="mt-1 truncate text-[13px] font-semibold leading-snug text-[#1c1a17]"
        style={hl && hlColor ? { color: hlColor } : undefined}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

export function DecisionMemo({ recs, meta, summary, status }: DecisionMemoProps) {
  const top = recs[0];
  if (!top) return null;

  const g = groundingState(top, meta);
  const badge = BADGE_BY_KEY[g.key] ?? BADGE_BY_KEY.insufficient;

  const explanation = recommendationExplanation(top, summary);
  const impacts = impactCards(top);
  const evidences = evidenceCards(top, summary);
  const strategies = strategyCards(top);
  const steps = implementationSteps(top);
  const timeToValue = impacts[2]?.metric ?? "8 to 16 weeks";

  const orgs =
    typeof meta?.evidence_count?.unique_organizations === "number" ? meta.evidence_count.unique_organizations : null;
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="bg-white text-[#1c1a17]">
      {/* ===== Masthead ===== */}
      <div className="border-t border-[#e6e2db] px-6 pb-7 pt-6 sm:px-10 sm:pb-9 sm:pt-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c685f]">
          Executive Decision Brief &middot; Prepared by Compass &middot; {date}
        </p>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h1
            data-testid="decision-title"
            className="max-w-3xl font-serif text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1c1a17] sm:text-[38px]"
          >
            {actionTitle(top)}
          </h1>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold",
              badge.cls
            )}
          >
            <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
            {badge.text}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e6e2db] bg-[#e6e2db] sm:grid-cols-4">
          <MetaCell label="Decision" value="Approve bounded pilot" />
          <MetaCell label="Status" value={badge.text} hl hlColor={badge.ink} />
          <MetaCell label="Evidence" value="Evidence-backed" />
          <MetaCell label="Time to value" value={timeToValue} />
        </div>
      </div>

      {/* ===== 01 · Purpose ===== */}
      <section
        data-testid="section-decision"
        className="border-t border-[#e6e2db] px-6 py-8 sm:px-10 sm:py-9"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHead number="01" title="Purpose" tone={TONES.purpose} />
          <div className="mt-4 max-w-3xl space-y-2 text-[13.5px] leading-[1.65] text-[#2c2925]">
            <p>
              <span className="font-bold text-[#1c1a17]">Bottom line: </span>
              {explanation.one}
            </p>
            <p>{explanation.two}</p>
            <p>{explanation.three}</p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {impacts.map((c) => (
              <div
                key={c.label}
                data-testid="impact-card"
                className="rounded-lg bg-white px-5 py-5"
                style={{ borderTop: `3px solid ${TONES.purpose.accent}` }}
              >
                <p className="text-[28px] font-extrabold leading-none tracking-tight text-[#1c1a17] tabular-nums">{c.metric}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#6c685f]">{c.label}</p>
                <p className="mt-1 text-[12px] leading-[1.45] text-[#6c685f]">{c.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 02 · Evidence ===== */}
      <section
        data-testid="section-evidence"
        className="border-t border-[#e6e2db] px-6 py-8 sm:px-10 sm:py-9"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHead number="02" title="Evidence" tone={TONES.evidence} />
          <p className="mt-4 max-w-2xl text-[13px] font-medium leading-[1.55] text-[#2c2925]">{evidenceIntro(top)}</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {evidences.slice(0, 3).map((e) => (
              <div
                key={e.company}
                data-testid="evidence-card"
                className="rounded-lg bg-white px-5 py-5"
                style={{ borderTop: `3px solid ${TONES.evidence.accent}` }}
              >
                <p className="text-[15px] font-bold text-[#1c1a17]">{e.company}</p>
                {e.context && <p className="mt-1 text-[12px] leading-[1.45] text-[#6c685f]">{e.context}</p>}
                <ul className="mt-2 space-y-1.5">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#1c1a17]">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: TONES.evidence.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {evidences.length === 0 && (
              <div className="rounded-lg bg-white px-5 py-5 sm:col-span-3">
                <p className="text-[13px] italic text-[#6c685f]">Evidence is being catalogued.</p>
              </div>
            )}
            {evidences.length > 0 && evidences.length < 3 && (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#a9dce2] bg-white/50 px-5 py-5">
                <p className="text-[12px] italic text-[#6c685f]">Insufficient evidence</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 03 · Objectives ===== */}
      <section
        data-testid="section-strategy"
        className="border-t border-[#e6e2db] px-6 py-8 sm:px-10 sm:py-9"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHead number="03" title="Objectives" tone={TONES.objectives} />
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {strategies.map((s) => (
              <div
                key={s.heading}
                data-testid="strategy-card"
                className="rounded-lg bg-white px-5 py-5"
                style={{ borderTop: `3px solid ${TONES.objectives.accent}` }}
              >
                <p className="text-[16px] font-bold text-[#1c1a17]">{s.heading}</p>
                <p className="mt-2 text-[13px] leading-[1.5] text-[#2c2925]">{s.description}</p>
                <p className="mt-3 border-t border-[#e6e2db] pt-2.5 text-[12px] font-semibold text-[#1c1a17]">
                  Objective: <span className="font-medium" style={{ color: TONES.objectives.ink }}>{s.objective}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 04 · Next Steps ===== */}
      <section
        data-testid="section-implementation"
        className="border-t border-[#e6e2db] px-6 py-8 sm:px-10 sm:py-9"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHead number="04" title="Next Steps" tone={TONES.next} />
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div
                key={s.name}
                data-testid="implementation-step"
                className="rounded-lg bg-white px-5 py-5"
                style={{ borderTop: `3px solid ${TONES.next.accent}` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[16px] font-bold text-[#1c1a17]">Phase {i + 1}: {s.name}</p>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]"
                    style={{ backgroundColor: "rgba(106,90,205,0.12)", color: TONES.next.ink }}
                  >
                    {s.timeline}
                  </span>
                </div>
                <p className="mt-1.5 text-[11.5px] text-[#6c685f]">
                  Team responsible: <span className="font-semibold text-[#2c2925]">{s.team}</span>
                </p>
                <p className="mt-2.5 text-[13px] leading-[1.55] text-[#2c2925]">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md bg-[#1c1a17] px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-white">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TONES.next.accent }} />
              Implementation plan: 4 phases
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-md border border-[#c5bef0] bg-white px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.08em]"
              style={{ color: TONES.next.ink }}
            >
              Go / No-Go at pilot completion
            </span>
          </div>
        </div>
      </section>

      {/* ===== Footnote ===== */}
      <div className="border-t border-[#e6e2db] bg-white px-6 py-5 sm:px-10">
        <p className="text-[11px] leading-[1.55] text-[#6c685f]">
          Prepared by Compass &middot; Evidence-backed recommendation
          {orgs != null ? ` &middot; ${orgs.toLocaleString()} organizations in the evidence base` : ""}
          . This brief is a decision aid, not a guarantee of outcomes.
        </p>
      </div>
    </div>
  );
}

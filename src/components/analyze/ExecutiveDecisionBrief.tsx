"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const T = {
  page: "#F4F0E6",
  card: "#FBFAF6",
  border: "#D8D5CC",
  accent: "#0F6B64",
  accentLight: "#DDEBE6",
  text: "#102A2E",
  muted: "#65706D",
  faint: "#8C8776",
  amber: "#C2780A",
} as const;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div
      className="flex items-center gap-3 mb-2"
      style={{ fontFamily: "Urbanist, sans-serif" }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: T.accent }}
      >
        {num} — {label}
      </span>
      <span
        aria-hidden
        className="inline-block h-px flex-1 max-w-[40px]"
        style={{ backgroundColor: T.accent, opacity: 0.3 }}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[28px] md:text-[32px] font-semibold leading-[1.15] mb-6 md:mb-8"
      style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
    >
      {children}
    </h2>
  );
}

function KPICard({
  value,
  label,
  large,
}: {
  value: string;
  label: string;
  large?: boolean;
}) {
  return (
    <div
      className="rounded-lg px-6 py-5 md:px-8 md:py-6"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div
        className={cn(
          "font-bold leading-[1] mb-1",
          large ? "text-[36px] md:text-[44px]" : "text-[28px] md:text-[36px]"
        )}
        style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
      >
        {value}
      </div>
      <div
        className="text-[13px] md:text-[14px] font-medium leading-[1.25]"
        style={{ fontFamily: "Urbanist, sans-serif", color: T.muted }}
      >
        {label}
      </div>
    </div>
  );
}

function NarrativeParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[18px] md:text-[19px] leading-[1.6] max-w-[780px] mb-4"
      style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
    >
      {children}
    </p>
  );
}

function EvidenceCard({
  org,
  what,
  outcome,
  tier,
}: {
  org: string;
  what: string;
  outcome?: string;
  tier?: string;
}) {
  return (
    <div
      className="rounded-lg px-5 py-4"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div
        className="text-[15px] font-semibold mb-1"
        style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
      >
        {org}
      </div>
      <div
        className="text-[14px] leading-[1.45] mb-2"
        style={{ fontFamily: "Urbanist, sans-serif", color: T.muted }}
      >
        {what}
      </div>
      {outcome && (
        <div
          className="text-[13px] leading-[1.4]"
          style={{ fontFamily: "Urbanist, sans-serif", color: T.faint }}
        >
          {outcome}
        </div>
      )}
      {tier && (
        <div
          className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ color: T.accent }}
        >
          {tier}
        </div>
      )}
    </div>
  );
}

function ImplementationPhase({
  step,
  phase,
  duration,
  owner,
  actions,
  success,
  cost,
  isLast,
}: {
  step: number;
  phase: string;
  duration: string;
  owner: string;
  actions: string[];
  success: string;
  cost: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
          style={{
            backgroundColor: T.accentLight,
            color: T.accent,
            fontFamily: "Urbanist, sans-serif",
          }}
        >
          {String(step).padStart(2, "0")}
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[24px] mt-1" style={{ backgroundColor: T.accent, opacity: 0.2 }} />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-8">
        <div
          className="text-[17px] font-semibold mb-1"
          style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
        >
          {phase}
        </div>
        <div
          className="text-[13px] mb-3 flex gap-3 flex-wrap"
          style={{ fontFamily: "Urbanist, sans-serif", color: T.muted }}
        >
          <span>{duration}</span>
          <span aria-hidden>·</span>
          <span>{owner}</span>
          <span aria-hidden>·</span>
          <span>{cost}</span>
        </div>
        <ul className="space-y-1.5 mb-2">
          {actions.slice(0, 4).map((a, i) => (
            <li
              key={i}
              className="text-[14px] leading-[1.5]"
              style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
            >
              {a}
            </li>
          ))}
        </ul>
        <div
          className="text-[13px] leading-[1.4] italic"
          style={{ fontFamily: "Urbanist, sans-serif", color: T.faint }}
        >
          Success: {success}
        </div>
      </div>
    </div>
  );
}

function AlternativeRow({
  name,
  score,
  reason,
  recommended,
}: {
  name: string;
  score: number;
  reason: string;
  recommended?: boolean;
}) {
  return (
    <div
      className="rounded-lg px-5 py-4 flex items-center gap-4"
      style={{
        backgroundColor: recommended ? T.accentLight : T.card,
        border: `1px solid ${recommended ? T.accent : T.border}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div
          className="text-[15px] font-semibold"
          style={{ fontFamily: "Urbanist, sans-serif", color: T.text }}
        >
          {name}
          {recommended && (
            <span
              className="ml-2 text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{ color: T.accent }}
            >
              RECOMMENDED
            </span>
          )}
        </div>
        <div
          className="text-[13px] leading-[1.4] mt-0.5"
          style={{ fontFamily: "Urbanist, sans-serif", color: T.muted }}
        >
          {reason}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

function generateDecisionTitle(dm: any, rec: any): string {
  const omc = dm?.recommendation?.operating_model_change;
  if (omc) {
    const verb = omc.replace(/^Move from /, "").split(" to ")[0];
    if (verb) return verb.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  const titles: Record<string, string> = {
    "Workflow Automation": "Automate Inbound Call Handling",
    "AI Implementation": "Deploy AI-Powered Processing",
    "Software Implementation": "Implement Software Solution",
    "Process Redesign": "Redesign Operating Process",
    "Staffing Change": "Expand Team Capacity",
    "Hybrid Intervention": "Deploy Hybrid Solution",
    "No Action / Establish Baseline": "Establish Baseline First",
  };
  return titles[rec.family_name] || `Implement ${rec.family_name}`;
}

function evidenceText(e: any): string | undefined {
  if (e.cost_impact) return `Cost impact: ${e.cost_impact}`;
  if (e.cost_savings) return `Cost impact: ${e.cost_savings}`;
  const outcome = e.outcome;
  if (Array.isArray(outcome) && outcome.length > 0) return String(outcome[0]);
  if (typeof outcome === "string") return outcome;
  if (outcome && typeof outcome === "object") {
    return Object.values(outcome).filter(Boolean).slice(0, 2).join(" · ");
  }
  return undefined;
}

interface ExecutiveDecisionBriefProps {
  decisionModel: any;
  onImplement?: () => void;
}

export function ExecutiveDecisionBrief({
  decisionModel,
  onImplement,
}: ExecutiveDecisionBriefProps) {
  if (!decisionModel) return null;

  const rec = decisionModel.recommended_intervention;
  const prob = decisionModel.problem;
  const econ = rec?.economics;
  const path = decisionModel.implementation_path;
  const alts = decisionModel.alternatives_considered || [];
  const assumptions = econ?.assumptions || [];
  const contras = decisionModel.contraindications || [];
  const evidence = rec?.evidence || [];
  const cf = decisionModel.counterfactual_rationale;
  const methodology = decisionModel.methodology || {};

  if (!rec || !prob) return null;

  const implCost = econ?.implementation_cost_estimate;
  const implCostStr = implCost
    ? `$${(implCost / 1000).toFixed(0)}K`
    : "—";
  const savingsStr = econ?.expected_annual_savings
    ? `$${(econ.expected_annual_savings / 1_000_000).toFixed(2)}M`
    : "—";
  const paybackStr = econ?.payback_months
    ? `~${Math.ceil(econ.payback_months)} months`
    : "—";
  const roiStr = econ?.three_year_roi
    ? `${econ.three_year_roi}×`
    : "—";

  // Calculate implementation duration from path phases
  const durationWeeks = path
    ? path.reduce((acc: number, s: any) => {
        const dur = s.duration || "";
        const nums = (dur.match(/\d+/g) || []).map(Number);
        return acc + (nums.length >= 2 ? (nums[0] + nums[1]) / 2 : nums[0] || 0);
      }, 0)
    : 0;
  const durationStr =
    durationWeeks > 0
      ? `${Math.floor(durationWeeks)}–${Math.ceil(durationWeeks * 1.3)} weeks`
      : "12–17 weeks";

  return (
    <div
      className="mx-auto print:bg-white"
      style={{
        maxWidth: 1160,
        backgroundColor: T.page,
        fontFamily: "Urbanist, sans-serif",
      }}
    >
      {/* ================================================================ */}
      {/* 01 — DECISION RECOMMENDATION                                     */}
      {/* ================================================================ */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b print:border-0" style={{ borderColor: T.border }}>
        <Eyebrow num="01" label="Decision Recommendation" />

        <h1
          className="text-[40px] md:text-[46px] font-semibold leading-[1.08] tracking-[-0.02em] max-w-[800px] mb-8"
          style={{ color: T.text }}
        >
          {generateDecisionTitle(decisionModel, rec)}
        </h1>

        <NarrativeParagraph>
          {decisionModel.recommendation?.rationale
            ? decisionModel.recommendation.rationale
            : cf?.summary
              ? cf.summary.split(". ").slice(0, 2).join(". ") + "."
              : `${rec.family_name} addresses the ${prob.constraint_type} constraint in ${prob.workflow} with expected annual savings of ${savingsStr} against the current operating baseline.`}
        </NarrativeParagraph>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <KPICard value={savingsStr} label="Expected Annual Savings" large />
          <KPICard value={implCostStr} label="Implementation Cost" />
          <KPICard value={paybackStr} label="Expected Payback" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 02 — ECONOMICS                                                    */}
      {/* ================================================================ */}
      {econ && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="02" label="Economics" />
          <SectionTitle>Cost &amp; Savings Analysis</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {/* Scenario comparison */}
              <div className="space-y-3">
                {[
                  {
                    label: "Conservative",
                    value: econ.scenarios?.conservative,
                    pct: "P10",
                  },
                  {
                    label: "Expected",
                    value: econ.scenarios?.expected,
                    pct: "P50",
                  },
                  {
                    label: "Upside",
                    value: econ.scenarios?.upside,
                    pct: "P90",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: T.border }}
                  >
                    <span
                      className="text-[14px]"
                      style={{ color: T.muted, fontFamily: "Urbanist, sans-serif" }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-[16px] font-semibold"
                      style={{ color: T.text, fontFamily: "Urbanist, sans-serif" }}
                    >
                      {s.value ? `$${(s.value / 1_000_000).toFixed(2)}M` : "—"}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 text-[12px]"
                style={{ color: T.faint, fontFamily: "Urbanist, sans-serif" }}
              >
                Calculated from your operating baseline
              </div>
            </div>

            <div>
              <div
                className="text-[15px] leading-[1.55]"
                style={{ color: T.text, fontFamily: "Urbanist, sans-serif" }}
              >
                <p className="mb-3">
                  Current annual labor cost of{" "}
                  <strong>
                    $
                    {econ.current_annual_labor_cost
                      ? (econ.current_annual_labor_cost / 1_000_000).toFixed(2)
                      : "—"}
                    M
                  </strong>{" "}
                  is based on {prob.annual_volume?.toLocaleString() || "—"} items/year at{" "}
                  {prob.handling_time_hours || "—"} hours each at $
                  {prob.loaded_labor_cost || "—"}/hour.
                </p>
                <p className="mb-3">
                  At {econ.automatable_pct || "—"}% automatable, expected savings
                  are <strong>{savingsStr}/year</strong>.
                </p>
                <p>
                  Implementation cost of <strong>{implCostStr}</strong> is
                  derived from the 5-phase implementation plan below. Payback
                  within {paybackStr}. 3-year projected ROI: <strong>{roiStr}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 03 — WHY THIS INTERVENTION                                        */}
      {/* ================================================================ */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
        <Eyebrow num="03" label="Why This Intervention" />
        <SectionTitle>Why {rec.family_name}</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NarrativeParagraph>
            {decisionModel.recommendation?.rationale
              ? decisionModel.recommendation.rationale.split(". ").slice(0, 1).join(". ") + "."
              : `${rec.family_name} addresses the ${prob.constraint_type} constraint directly. At ${prob.annual_volume?.toLocaleString() || "—"} items/year with ${prob.exception_rate || "—"} exceptions, the workflow has enough volume and standardization to justify the investment.`}
          </NarrativeParagraph>

          <div className="space-y-3">
            {[
              {
                reason: "High Volume",
                detail: `${prob.annual_volume?.toLocaleString() || "—"} items/year creates enough repetition for automation economics`,
              },
              {
                reason: "Repeatable Work",
                detail: `Standardization level: ${prob.standardization || "—"} with ${prob.exception_rate || "—"} exceptions`,
              },
              {
                reason: "Strong Economics",
                detail: `Expected ${savingsStr}/year savings against ${implCostStr} implementation — ${paybackStr} payback`,
              },
              {
                reason: "Implementable",
                detail: `Fits within stated budget (${prob.budget_range || "—"}) and timeline (${prob.timeline || "—"})`,
              },
            ].map((item) => (
              <div
                key={item.reason}
                className="rounded-lg px-5 py-4"
                style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
              >
                <div
                  className="text-[14px] font-semibold mb-0.5"
                  style={{ color: T.text, fontFamily: "Urbanist, sans-serif" }}
                >
                  {item.reason}
                </div>
                <div
                  className="text-[13px] leading-[1.4]"
                  style={{ color: T.muted, fontFamily: "Urbanist, sans-serif" }}
                >
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 04 — EVIDENCE                                                    */}
      {/* ================================================================ */}
      {evidence.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="04" label="Evidence" />
          <SectionTitle>Comparable Implementations</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evidence.slice(0, 3).map((e: any, i: number) => (
              <EvidenceCard
                key={i}
                org={e.organization || e.company || "—"}
                what={e.intervention || e.what_they_did || "—"}
                outcome={evidenceText(e)}
                tier={i === 0 ? "DIRECT COMPARABLE" : "SUPPORTING"}
              />
            ))}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 05 — ALTERNATIVES CONSIDERED                                      */}
      {/* ================================================================ */}
      {alts.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="05" label="Alternatives Considered" />
          <SectionTitle>Why Not the Alternatives</SectionTitle>

          <div className="space-y-3 max-w-[780px]">
            {alts.slice(0, 4).map((alt: any, i: number) => {
              const altCf = cf?.per_alternative?.find(
                (c: any) => c.alternative === alt.family_name
              );
              return (
                <AlternativeRow
                  key={i}
                  name={alt.family_name}
                  score={alt.overall_score}
                  reason={
                    altCf?.rationale ||
                    `Ranked below ${rec.family_name} on overall fit for this constraint`
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 06 — IMPLEMENTATION PATH                                          */}
      {/* ================================================================ */}
      {path && path.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="06" label="Implementation Path" />
          <SectionTitle>How to Implement</SectionTitle>

          {/* Summary bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <KPICard value={implCostStr} label="Estimated Implementation Cost" />
            <KPICard value={durationStr} label="Estimated Duration" />
          </div>

          <div className="max-w-[780px]">
            {path.map((step: any, i: number) => (
              <ImplementationPhase
                key={step.step}
                step={step.step}
                phase={step.phase}
                duration={step.duration}
                owner={step.owner}
                actions={step.actions || []}
                success={step.success_criteria}
                cost={step.cost}
                isLast={i === path.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 07 — ASSUMPTIONS & RISKS                                          */}
      {/* ================================================================ */}
      <section className="px-6 md:px-12 py-16 md:py-20">
        <Eyebrow num="07" label="Assumptions &amp; Risks" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px]">
          <div>
            <div
              className="text-[13px] font-semibold uppercase tracking-[0.08em] mb-3"
              style={{ color: T.muted, fontFamily: "Urbanist, sans-serif" }}
            >
              Assumptions
            </div>
            <ul className="space-y-2">
              {assumptions.slice(0, 8).map((a: string, i: number) => (
                <li
                  key={i}
                  className="text-[14px] leading-[1.5]"
                  style={{ color: T.text, fontFamily: "Urbanist, sans-serif" }}
                >
                  • {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div
              className="text-[13px] font-semibold uppercase tracking-[0.08em] mb-3"
              style={{ color: T.muted, fontFamily: "Urbanist, sans-serif" }}
            >
              Risks &amp; Contraindications
            </div>
            <ul className="space-y-2">
              {decisionModel.risks && decisionModel.risks.length > 0
                ? decisionModel.risks.map((r: string, i: number) => (
                    <li
                      key={i}
                      className="text-[14px] leading-[1.5] flex items-start gap-2"
                      style={{ color: T.amber, fontFamily: "Urbanist, sans-serif" }}
                    >
                      <span aria-hidden>⚠</span> {r}
                    </li>
                  ))
                : [
                    "Integration complexity with existing systems",
                    "Customer experience during transition period",
                    "Exception handling quality for edge cases",
                    "User adoption and training requirements",
                  ].map((r, i) => (
                    <li
                      key={i}
                      className="text-[14px] leading-[1.5] flex items-start gap-2"
                      style={{ color: T.amber, fontFamily: "Urbanist, sans-serif" }}
                    >
                      <span aria-hidden>⚠</span> {r}
                    </li>
                  ))}
              {contras.map((c: string, i: number) => (
                <li
                  key={`contra-${i}`}
                  className="text-[14px] leading-[1.5] flex items-start gap-2"
                  style={{ color: T.amber, fontFamily: "Urbanist, sans-serif" }}
                >
                  <span aria-hidden>⚠</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* APPROVE BUTTON                                                    */}
      {/* ================================================================ */}
      <div className="px-6 md:px-12 pb-20">
        <button
          onClick={onImplement}
          className="rounded-lg px-8 py-4 text-[15px] font-semibold transition-colors"
          style={{
            backgroundColor: T.accent,
            color: "#FFFFFF",
            fontFamily: "Urbanist, sans-serif",
          }}
        >
          Approve &amp; Launch Pilot
        </button>

        <div
          className="mt-4 text-[12px]"
          style={{ color: T.faint, fontFamily: "Urbanist, sans-serif" }}
        >
          Engine: {methodology.engine_version || "decision-v1"} ·{" "}
          {methodology.weights_tuned_for
            ? `Weights: ${methodology.weights_tuned_for}`
            : ""}{" "}
          · Invariants:{" "}
          {methodology.invariants_valid ? "✓ pass" : "✗ violations"}
          {methodology.gap_engine_connected ? " · Gap engine: connected" : ""}
        </div>
      </div>
    </div>
  );
}

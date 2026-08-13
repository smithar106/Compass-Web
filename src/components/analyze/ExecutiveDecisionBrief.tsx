"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const T = {
  page: "#F5F1E8",
  card: "#FBFAF6",
  border: "#D0C9B8",
  accent: "#0A5C55",
  accentDeep: "#07423D",
  accentLight: "#E6F2F0",
  text: "#000000",
  muted: "#1A1A1A",
  faint: "#333333",
  gold: "#8B6914",
  goldLight: "#FBF3E0",
  silver: "#4A5568",
  silverLight: "#F1F3F6",
  bronze: "#7C5E10",
  bronzeLight: "#FDF6E8",
  rose: "#9D174D",
  roseLight: "#FDE8F0",
  warning: "#B45309",
} as const;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Eyebrow({ num, label, color }: { num: string; label: string; color?: string }) {
  const c = color ?? T.accent;
  return (
    <div
      className="flex items-center gap-3 mb-2"
      style={{ fontFamily: "Urbanist, sans-serif" }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: c }}
      >
        {num} — {label}
      </span>
      <span
        aria-hidden
        className="inline-block h-px flex-1 max-w-[40px]"
        style={{ backgroundColor: c, opacity: 0.4 }}
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
  color,
}: {
  value: string;
  label: string;
  large?: boolean;
  color?: string;
}) {
  return (
    <div
      className="rounded-lg px-6 py-5 md:px-8 md:py-6 relative overflow-hidden"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      {color && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-1 w-full"
          style={{ backgroundColor: color }}
        />
      )}
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
  color,
  sourceType,
  sourceUrl,
}: {
  org: string;
  what: string;
  outcome?: string;
  tier?: string;
  color?: string;
  sourceType?: string;
  sourceUrl?: string;
}) {
  const c = color ?? T.accent;
  return (
    <div
      className="rounded-lg px-5 py-4 relative overflow-hidden"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-1 w-full"
        style={{ backgroundColor: c }}
      />
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
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {tier && (
          <div
            className="text-[11px] font-medium uppercase tracking-[0.08em]"
            style={{ color: c }}
          >
            {tier}
          </div>
        )}
        {sourceType && sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors hover:underline"
            style={{
              backgroundColor: sourceType === "Independently Verified" ? "#E6F2F0" : sourceType === "Vendor Case Study" ? "#FDF6E8" : "#F0F7F6",
              color: sourceType === "Independently Verified" ? T.accent : sourceType === "Vendor Case Study" ? T.gold : "#0A5C55",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {sourceType} ↗
          </a>
        )}
        {sourceType && !sourceUrl && (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: sourceType === "Independently Verified" ? "#E6F2F0" : sourceType === "Vendor Case Study" ? "#FDF6E8" : "#F0F7F6",
              color: sourceType === "Independently Verified" ? T.accent : sourceType === "Vendor Case Study" ? T.gold : "#0A5C55",
            }}
          >
            {sourceType}
          </span>
        )}
      </div>
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
            backgroundColor: T.silverLight,
            color: T.silver,
            border: `2px solid ${T.silver}`,
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
      className="rounded-lg px-5 py-4 flex items-center gap-4 relative overflow-hidden"
      style={{
        backgroundColor: recommended ? T.accentLight : T.card,
        border: `1px solid ${recommended ? T.accent : T.border}`,
      }}
    >
      {!recommended && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-1"
          style={{ backgroundColor: T.rose }}
        />
      )}
      <div className="flex-1 min-w-0 pl-2">
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
  const evidence = rec?.evidence || [];
  const cf = decisionModel.counterfactual_rationale;
  const confidence = decisionModel.recommendation_confidence || "moderate";
  const confidenceLabels: Record<string, string> = {
    high: "High confidence",
    moderate: "Moderate confidence",
    low: "Lower confidence — limited direct evidence",
  };
  const evidenceWidened = decisionModel.confidence_limits?.some(
    (l: any) => l.source === "evidence_retrieval" && l.reason?.includes("Only ")
  );

  if (!rec || !prob) return null;

  const implCost = econ?.implementation_cost_estimate;
  const implCostStr = implCost
    ? `$${(implCost / 1000).toFixed(0)}K`
    : "—";
  const savingsStr = econ?.expected_annual_savings
    ? `$${(econ.expected_annual_savings / 1_000_000).toFixed(2)}M`
    : "—";
  const paybackStr = econ?.payback_months
    ? `~${Math.ceil(econ.payback_months)} month${Math.ceil(econ.payback_months) === 1 ? "" : "s"}`
    : "—";
  const roiStr = econ?.three_year_roi
    ? `${econ.three_year_roi}×`
    : "—";

  // Generate adaptive implementation phases based on intervention family
  const adaptivePath = (() => {
    const family = (rec?.family_name || rec?.category || "").toLowerCase();
    const isAI = family.includes("ai");
    const isAutomation = family.includes("automation") || family.includes("workflow");
    const isProcess = family.includes("process") || family.includes("redesign");
    const isStaffing = family.includes("staffing");
    const isSoftware = family.includes("software");

    if (isAI) return [
      { step: 1, phase: "Establish the Baseline", duration: "Week 1–2", owner: "Operations Lead", actions: ["Document current workflow steps and timing", "Measure current accuracy and exception rate", "Define acceptance criteria for the pilot"], success: "Baseline metrics captured and signed off", cost: "Internal time only" },
      { step: 2, phase: "Data Readiness & Preparation", duration: "Weeks 2–4", owner: "Data / IT Team", actions: ["Audit data quality for training inputs", "Clean and label historical examples", "Define data pipeline and refresh cadence"], success: "Training dataset validated with example coverage ≥80%", cost: "Light engineering" },
      { step: 3, phase: "Model Configuration & Testing", duration: "Weeks 4–8", owner: "Implementation Team", actions: ["Configure the AI model against the training data", "Run offline evaluation on a holdout set", "Tune thresholds for precision vs. recall"], success: "Offline accuracy meets acceptance criteria", cost: "Model configuration + testing" },
      { step: 4, phase: "Run the Pilot", duration: "Weeks 8–12", owner: "Operations + Implementation", actions: ["Deploy to a limited volume or subset", "Run in shadow mode with human review", "Track accuracy, exception rate, and human override rate"], success: "Pilot KPIs within 10% of targets; no increase in error rate", cost: "Pilot operations" },
      { step: 5, phase: "Scale Deployment", duration: "Weeks 12–16", owner: "Implementation Team", actions: ["Expand to full volume", "Remove shadow review for high-confidence cases", "Set up ongoing monitoring and retraining cadence"], success: "Full deployment with monitoring in place", cost: "Full implementation" },
    ];

    if (isAutomation) return [
      { step: 1, phase: "Map the Current Workflow", duration: "Week 1–2", owner: "Operations Lead", actions: ["Document every step, decision point, and handoff", "Identify which steps are deterministic vs. require judgment", "Measure current throughput and error rate"], success: "Workflow map signed off; automation candidates identified", cost: "Internal time only" },
      { step: 2, phase: "Configure Automation Rules", duration: "Weeks 2–4", owner: "Implementation Team", actions: ["Define deterministic routing rules", "Set up exception queues for human review", "Configure integrations with existing systems"], success: "Rules tested against historical data; exception rate <15%", cost: "Light configuration" },
      { step: 3, phase: "Run the Pilot", duration: "Weeks 4–8", owner: "Operations + Implementation", actions: ["Deploy automation on a subset of volume", "Monitor throughput, accuracy, and exception rate", "Adjust rules based on pilot data"], success: "Throughput improved; error rate unchanged or better", cost: "Pilot operations" },
      { step: 4, phase: "Scale Deployment", duration: "Weeks 8–12", owner: "Implementation Team", actions: ["Expand to full volume", "Train team on exception handling workflow", "Set up ongoing monitoring and rule refinement"], success: "Full deployment with monitoring", cost: "Full implementation" },
    ];

    if (isProcess) return [
      { step: 1, phase: "Document the Current State", duration: "Week 1–2", owner: "Operations Lead", actions: ["Map the current process end-to-end", "Identify bottlenecks, rework loops, and unnecessary steps", "Interview stakeholders across the workflow"], success: "Current-state map complete with pain points documented", cost: "Internal time only" },
      { step: 2, phase: "Design the Future State", duration: "Weeks 2–4", owner: "Process Owner", actions: ["Define the target process with clear ownership", "Remove redundant steps and handoffs", "Document new decision rights and escalation paths"], success: "Future-state design signed off by all stakeholders", cost: "Workshop time" },
      { step: 3, phase: "Pilot the New Process", duration: "Weeks 4–8", owner: "Operations Lead", actions: ["Train the team on the new process", "Run the new process on a subset of volume", "Collect feedback and adjust"], success: "Process running as designed; team feedback incorporated", cost: "Training + pilot oversight" },
      { step: 4, phase: "Roll Out & Standardize", duration: "Weeks 8–12", owner: "Process Owner", actions: ["Expand to full volume across the team", "Document the standardized process", "Establish review cadence and continuous improvement"], success: "Process standardized; review cadence established", cost: "Rollout cost" },
    ];

    if (isStaffing) return [
      { step: 1, phase: "Define Capacity Requirements", duration: "Week 1–2", owner: "Operations Lead", actions: ["Quantify the capacity gap based on current volume", "Define the role, skills required, and reporting structure", "Draft the cost-benefit analysis for staffing vs. alternatives"], success: "Capacity requirements documented and approved", cost: "Internal time only" },
      { step: 2, phase: "Recruit or Reallocate", duration: "Weeks 2–6", owner: "HR / Operations", actions: ["Post the role or identify internal candidates", "Screen and interview candidates", "Make an offer and set start date"], success: "Candidate hired with start date", cost: "Recruiting cost" },
      { step: 3, phase: "Onboard & Train", duration: "Weeks 6–10", owner: "Operations Lead", actions: ["Set up systems access and tools", "Train on the workflow and tools", "Run shadowing with an experienced team member"], success: "New hire operating independently", cost: "Training time" },
      { step: 4, phase: "Measure Impact", duration: "Weeks 10–14", owner: "Operations Lead", actions: ["Track throughput and quality with additional capacity", "Compare against pre-hire baseline", "Adjust process as needed"], success: "Capacity gap closed; quality maintained", cost: "Ongoing labor cost" },
    ];

    if (isSoftware) return [
      { step: 1, phase: "Requirements & Vendor Selection", duration: "Weeks 1–3", owner: "Operations + IT", actions: ["Define functional requirements and integration needs", "Evaluate candidate software/vendors", "Select the best-fit solution"], success: "Vendor selected; contract signed", cost: "Evaluation time" },
      { step: 2, phase: "Configuration & Integration", duration: "Weeks 3–6", owner: "Implementation Team", actions: ["Configure the software to match the workflow", "Integrate with existing systems and data sources", "Set up user roles, permissions, and reporting"], success: "Software configured and integrated; UAT passed", cost: "Configuration + integration" },
      { step: 3, phase: "Run the Pilot", duration: "Weeks 6–10", owner: "Operations Lead", actions: ["Deploy to a pilot group", "Train users on the new software", "Collect feedback and adjust configuration"], success: "Pilot users productive on the new system", cost: "Pilot operations" },
      { step: 4, phase: "Full Rollout", duration: "Weeks 10–14", owner: "Implementation Team", actions: ["Expand to all users", "Run training sessions for the full team", "Set up ongoing support and maintenance"], success: "Full team onboarded; support structure in place", cost: "Full implementation" },
    ];

    return path;
  })();

  const displayPath = adaptivePath?.length ? adaptivePath : path;
  const durationWeeks = (() => {
    if (!displayPath || !displayPath.length) return 0;
    let maxEnd = 0;
    for (const s of displayPath) {
      const dur = (s.duration || "").toString();
      const nums = (dur.match(/\d+/g) || []).map(Number);
      if (nums.length >= 2 && nums[1] > maxEnd) maxEnd = nums[1];
      else if (nums.length === 1 && nums[0] > maxEnd) maxEnd = nums[0];
    }
    return maxEnd;
  })();
  const durationStr =
    durationWeeks > 0
      ? `~${durationWeeks} weeks`
      : "~12 weeks";

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
      <section className="px-6 md:px-12 py-16 md:py-24 border-b print:border-0"
        style={{ borderColor: T.border, borderLeft: `4px solid ${T.gold}` }}>
        <Eyebrow num="01" label="Decision Recommendation" color={T.gold} />

        <div className="flex flex-wrap items-baseline gap-3 mb-4">
          <h1
            className="text-[40px] md:text-[46px] font-semibold leading-[1.08] tracking-[-0.02em] max-w-[800px]"
            style={{ color: T.text }}
          >
            {rec.title || rec.executive_title || rec.family_name}
          </h1>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
            style={{
              backgroundColor: confidence === "low" ? "#FEF3C7" : confidence === "high" ? "#E6F2F0" : "#F1F3F6",
              color: confidence === "low" ? "#92400E" : confidence === "high" ? T.accent : T.silver,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: confidence === "low" ? "#F59E0B" : confidence === "high" ? T.accent : T.silver }}
            />
            {confidenceLabels[confidence] || "Moderate confidence"}
          </span>
        </div>

        {rec.operating_model_change && (
          <p
            className="text-[16px] leading-[1.5] max-w-[780px] mb-4"
            style={{ fontFamily: "Urbanist, sans-serif", color: T.muted }}
          >
            {rec.operating_model_change}
          </p>
        )}

        <NarrativeParagraph>
          {(() => {
            const altNames = alts.map((a: any) => a.family_name).filter(Boolean);
            const altSummary = altNames.length
              ? ` Other alternatives that were considered—${altNames.slice(0, 3).join(", ")}${altNames.length > 3 ? ", and others" : ""}—were either more costly, slower to implement, or did not adequately address this specific problem.`
              : "";
            const constraint = (prob.constraint_type || "").toLowerCase();
            const constraintReason = constraint.includes("capacity")
              ? "given the current capacity gap"
              : constraint.includes("speed") || constraint.includes("slow")
                ? "given the processing time gap against service levels"
                : constraint.includes("cost")
                  ? "given the current cost structure"
                  : constraint.includes("quality") || constraint.includes("error")
                    ? "given the rework and quality issues"
                    : constraint.includes("risk") || constraint.includes("compliance")
                      ? "given the risk and compliance exposure"
                      : "";
            const repeatability = prob.standardization
              ? ` The workflow is ${prob.standardization.toLowerCase()}${
                  prob.exception_rate ? ` with ${prob.exception_rate} exceptions` : ""
                }, making it well-suited to this approach.`
              : "";
            const implDesc = rec.implementation_pattern
              ? ` ${rec.implementation_pattern}`
              : "";
            if (!Number.isFinite(implCost) || !Number.isFinite(econ?.expected_annual_savings)) {
              return `This approach is the most cost-effective path${constraintReason ? ` ${constraintReason}` : ""}.${repeatability}${implDesc}${altSummary} Begin with a bounded pilot and scale only after the economics are validated against the current baseline.`;
            }
            const savings = econ.expected_annual_savings;
            const payback = econ.payback_months;
            const paybackText = payback ? ` with an expected payback of ~${Math.ceil(payback)} month${Math.ceil(payback) === 1 ? "" : "s"}` : "";
            return `This approach is expected to save $${(savings / 1000).toFixed(0)}K annually against a $${(implCost / 1000).toFixed(0)}K implementation cost${paybackText}. It ranked highest after comparing problem fit, economics, risk, feasibility, and available evidence.${repeatability}${implDesc}${altSummary}`;
          })()}
        </NarrativeParagraph>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <KPICard value={savingsStr} label="Expected Annual Savings" large color={T.accent} />
          <KPICard value={implCostStr} label="Implementation Cost" color={T.gold} />
          <KPICard value={paybackStr} label="Expected Payback" color={T.silver} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 02 — ECONOMICS                                                    */}
      {/* ================================================================ */}
      {econ && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="02" label="Economics" color={T.accent} />
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
                {(() => {
                  const constraint = (prob.constraint_type || "").toLowerCase();
                  const isRevenue = constraint.includes("revenue") || constraint.includes("growth");
                  const isRisk = constraint.includes("risk") || constraint.includes("compliance");
                  const isQuality = constraint.includes("quality") || constraint.includes("error") || constraint.includes("inconsistent");
                  const isSpeed = constraint.includes("speed") || constraint.includes("slow") || constraint.includes("sla");
                  const isCapacity = constraint.includes("capacity") || constraint.includes("volume");

                  if (isRevenue) {
                    return (
                      <>
                        <p className="mb-3">
                          Expected annual revenue gain of <strong>{savingsStr}</strong> based on{" "}
                          {prob.annual_volume?.toLocaleString() || "projected"} transactions/year and
                          the value of each incremental conversion or expansion.
                        </p>
                        <p className="mb-3">
                          Revenue impact is modeled from the current gap between target and actual
                          performance. Implementation cost of <strong>{implCostStr}</strong> is
                          recovered within {paybackStr}.
                        </p>
                      </>
                    );
                  }

                  if (isRisk || isQuality) {
                    return (
                      <>
                        <p className="mb-3">
                          The current workflow operates at a risk or quality level that carries
                          measurable exposure. Expected annual value of <strong>{savingsStr}</strong>{" "}
                          reflects the cost of errors, rework, and exposure that the recommended
                          intervention is designed to reduce.
                        </p>
                        <p className="mb-3">
                          At {econ.automatable_pct || "—"}% of the workflow addressable, the
                          implementation cost of <strong>{implCostStr}</strong> pays back within{" "}
                          {paybackStr}.
                        </p>
                      </>
                    );
                  }

                  if (isSpeed) {
                    return (
                      <>
                        <p className="mb-3">
                          Current processing time creates a gap against expected service levels.
                          Expected annual value of <strong>{savingsStr}</strong> reflects the
                          economic impact of reducing processing time to target levels.
                        </p>
                        <p className="mb-3">
                          Implementation cost of <strong>{implCostStr}</strong> is derived from the
                          implementation plan below. Payback within {paybackStr}. 3-year projected
                          ROI: <strong>{roiStr}</strong>.
                        </p>
                      </>
                    );
                  }

                  return (
                    <>
                      {prob.annual_volume && prob.handling_time_hours && prob.loaded_labor_cost ? (
                        <p className="mb-3">
                          Current annual labor cost of{" "}
                          <strong>
                            $
                            {econ.current_annual_labor_cost
                              ? (econ.current_annual_labor_cost / 1_000_000).toFixed(2)
                              : "—"}
                            M
                          </strong>{" "}
                          is based on {prob.annual_volume.toLocaleString()} items/year at{" "}
                          {prob.handling_time_hours} hours each at $
                          {prob.loaded_labor_cost}/hour.
                        </p>
                      ) : (
                        <p className="mb-3">
                          Economics are derived from the workflow volume, handling time, and labor
                          costs provided in the assessment. Expected annual value of{" "}
                          <strong>{savingsStr}</strong> reflects the projected impact of the
                          recommended intervention against the current operating baseline.
                        </p>
                      )}
                      <p className="mb-3">
                        At {econ.automatable_pct || "—"}% automatable, expected savings
                        are <strong>{savingsStr}/year</strong>.
                      </p>
                      <p>
                        Implementation cost of <strong>{implCostStr}</strong> is
                        derived from the implementation plan below. Payback
                        within {paybackStr}. 3-year projected ROI: <strong>{roiStr}</strong>.
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: T.gold }} />
              Direct comparable — similar workflow and intervention in a comparable organization
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: T.silver }} />
              Supporting — relevant outcome in an adjacent domain or intervention type
            </span>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 03 — WHY THIS INTERVENTION                                        */}
      {/* ================================================================ */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
        <Eyebrow num="03" label="Why This Intervention" color={T.accent} />
        <SectionTitle>Why We Recommend This</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NarrativeParagraph>
            {(() => {
              const constraint = prob.constraint_type
                ? `, which is constrained by ${prob.constraint_type.toLowerCase()}`
                : "";
              return `The recommendation is based on the volume and repeatability of this workflow${constraint}. The evidence shows this is the most cost-effective path, and every rejected alternative was scored against the same criteria.`;
            })()}
          </NarrativeParagraph>

          <div className="space-y-3">
            {(() => {
              const bullets: { reason: string; detail: string }[] = [];
              if (prob.annual_volume) {
                bullets.push({
                  reason: "High Volume",
                  detail: `${prob.annual_volume.toLocaleString()} items/year creates enough repetition for automation economics`,
                });
              }
              if (prob.standardization) {
                bullets.push({
                  reason: "Repeatable Work",
                  detail: `Standardization level: ${prob.standardization}${prob.exception_rate ? ` with ${prob.exception_rate} exceptions` : ""}`,
                });
              }
              if (econ?.expected_annual_savings || econ?.payback_months) {
                bullets.push({
                  reason: "Strong Economics",
                  detail: `Expected ${savingsStr}/year savings against ${implCostStr} implementation${econ?.payback_months ? ` — ${paybackStr} payback` : ""}`,
                });
              }
              if (prob.budget_range || prob.timeline) {
                bullets.push({
                  reason: "Implementable",
                  detail: `Fits within stated budget${prob.budget_range ? ` (${prob.budget_range})` : ""}${prob.timeline ? ` and timeline (${prob.timeline})` : ""}`,
                });
              }
              return bullets.map((item) => (
                <div
                  key={item.reason}
                  className="rounded-lg px-5 py-4 relative overflow-hidden"
                  style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ backgroundColor: T.accent }}
                  />
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
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 04 — EVIDENCE                                                    */}
      {/* ================================================================ */}
      {evidence.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="04" label="Evidence" color={T.gold} />
          <SectionTitle>What Happened in Comparable Implementations</SectionTitle>

          {evidenceWidened && (
            <div className="mb-6 rounded-lg border px-4 py-3" style={{ borderColor: "#FCD34D", backgroundColor: "#FFFBEB" }}>
              <p className="text-[12px] leading-relaxed" style={{ color: "#92400E" }}>
                Directly comparable evidence is limited. Compass shows only the implementations
                that independently passed the relevance threshold for this workflow and intervention.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evidence.slice(0, 3).map((e: any, i: number) => {
              const tier = (e.evidence_tier || "").toLowerCase();
              const tierColor = tier === "gold" ? T.gold : tier === "silver" ? T.silver : T.bronze;
              const sourceType = e.independently_verified
                ? "Independently Verified"
                : e.vendor_reported
                  ? "Vendor Case Study"
                  : "Company Disclosure";
              const sourceUrl = e.source_url as string | undefined;
              const relevance = e.relevance || (i === 0 ? "direct" : "supporting");
              return (
                <EvidenceCard
                  key={i}
                  org={e.organization || e.company || "—"}
                  what={e.intervention || e.what_they_did || "—"}
                  outcome={evidenceText(e)}
                  tier={relevance === "direct" ? "DIRECT COMPARABLE" : "SUPPORTING"}
                  color={tierColor}
                  sourceType={sourceType}
                  sourceUrl={sourceUrl}
                />
              );
            })}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed" style={{ color: T.faint }}>
            Observed outcomes from comparable implementations. These results are not projections
            for your organization — they validate the intervention path, not your expected result.
          </p>
        </section>
      )}

      {/* ================================================================ */}
      {/* 05 — ALTERNATIVES CONSIDERED                                      */}
      {/* ================================================================ */}
      {alts.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="05" label="Alternatives Considered" color={T.rose} />
          <SectionTitle>Why Not the Alternatives</SectionTitle>

          <div className="space-y-3 max-w-[780px]">
            {alts.slice(0, 4).map((alt: any, i: number) => {
              const altCf = cf?.per_alternative?.find(
                (c: any) => c.alternative === alt.family_name
              );
              const raw = altCf?.rationale as string | undefined;
              const cleaned = raw
                ? raw
                    .replace(/^(and|but|or|so|yet|,)\s*/i, "")
                    .replace(/^[a-z]/, (c) => c.toUpperCase())
                    .replace(/\.\s*$/, "")
                : "";
              const reason =
                cleaned ||
                `${rec.family_name} is better suited to this problem based on fit, cost, evidence, and feasibility.`;
              return (
                <AlternativeRow
                  key={i}
                  name={alt.family_name}
                  score={alt.overall_score}
                  reason={reason}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 06 — SUCCESS CRITERIA (HOW WE'LL MEASURE SUCCESS)                 */}
      {/* ================================================================ */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
        <Eyebrow num="06" label="Success Criteria" color={T.accent} />
        <SectionTitle>How We&apos;ll Measure Success</SectionTitle>

        <p className="text-[16px] leading-[1.6] max-w-[780px] mb-8" style={{ color: T.muted }}>
          Before leadership approves this decision, Compass establishes the measurement contract defining exactly how success will be verified.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px]">
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Primary Business Objective</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">Reduce cost and cycle time while maintaining quality standards.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Primary Success Metric</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">{rec.outcome_ranges?.[0]?.metric_label || "Processing cost / handling efficiency"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Current Baseline vs. Target</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">Baseline: Customer confirmation required · Target: {savingsStr}/yr value</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Measurement Window &amp; Frequency</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">90 days post-rollout · Weekly tracking cadence</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Guardrail Metrics</p>
            <p className="mt-1 text-[14px] text-muted">Quality &amp; error rate cannot decline by &gt;5% during pilot.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Data Source &amp; Owner</p>
            <p className="mt-1 text-[14px] text-muted">Enterprise System / Operational Logs · Operations Owner</p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 07 — IMPLEMENTATION PATH                                          */}
      {/* ================================================================ */}
      {displayPath && displayPath.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-20 border-b print:border-0" style={{ borderColor: T.border }}>
          <Eyebrow num="07" label="Implementation Path" color={T.silver} />
          <SectionTitle>How to Implement</SectionTitle>

          {/* Summary bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <KPICard value={implCostStr} label="Estimated Implementation Cost" color={T.gold} />
            <KPICard value={durationStr} label="Estimated Duration" color={T.silver} />
          </div>

          <div className="max-w-[780px]">
            {displayPath.map((step: any, i: number) => (
              <ImplementationPhase
                key={step.step}
                step={step.step}
                phase={step.phase}
                duration={step.duration}
                owner={step.owner}
                actions={step.actions || []}
                success={step.success_criteria || step.success || ""}
                cost={step.cost || ""}
                isLast={i === displayPath.length - 1}
              />
            ))}
          </div>
        </section>
      )}

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

        <div className="mt-5 max-w-[600px] rounded-lg border border-line px-4 py-3" style={{ backgroundColor: T.card }}>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: T.accent }}>What happens next</p>
          <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: T.muted }}>
            Approval moves this decision to the Implementation Command Center. The baseline metrics
            will be captured, the first phase will begin, and progress will be tracked against the
            milestones and success criteria defined in this brief.
          </p>
        </div>


      </div>
    </div>
  );
}

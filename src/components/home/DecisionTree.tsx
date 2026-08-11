"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

type Step = "problem" | "assess" | "compare" | "recommend" | "execute" | "measure" | "learn";

const C = {
  gold: "#8B6914",
  teal: "#0A5C55",
  blue: "#1E40AF",
  purple: "#6D28D9",
  green: "#14532D",
  red: "#9D174D",
  silver: "#4A5568",
} as const;

const PROBLEMS = [
  { id: "cost", label: "Reduce cost", icon: "↓" },
  { id: "capacity", label: "Increase capacity", icon: "↑" },
  { id: "revenue", label: "Grow revenue", icon: "↗" },
  { id: "risk", label: "Reduce risk", icon: "🛡" },
  { id: "cx", label: "Improve customer experience", icon: "★" },
] as const;

const ASSESS_DIMS = [
  "Volume", "Labor cost", "Exceptions", "Standardization", "Risk tolerance", "Budget", "Timeline",
] as const;

const INTERVENTIONS: Array<{ id: string; name: string; score: number; color: string; width: string; best?: boolean }> = [
  { id: "ai", name: "AI", score: 72, color: C.purple, width: "72%" },
  { id: "automation", name: "Automation", score: 91, color: C.teal, width: "91%", best: true },
  { id: "software", name: "Software", score: 68, color: C.blue, width: "68%" },
  { id: "process", name: "Process Redesign", score: 77, color: C.gold, width: "77%" },
  { id: "staffing", name: "Staffing", score: 43, color: C.red, width: "43%" },
  { id: "hybrid", name: "Hybrid", score: 81, color: C.silver, width: "81%" },
];

const WHY_WINNING = [
  "High transaction volume",
  "Highly standardized workflow",
  "Low exception rate",
  "Strong economics",
  "Relevant comparable implementations",
] as const;

const WHY_NOT_AI = "Additional model complexity doesn't produce enough incremental value.";
const WHY_NOT_STAFFING = "Higher recurring cost and slower payback.";

const EXECUTION_PATHS = [
  {
    id: "internal",
    title: "Your Team",
    subtitle: "Implement internally",
    note: "Full plan and success criteria provided",
    icon: "○",
    color: C.silver,
  },
  {
    id: "partner",
    title: "Implementation Partner",
    subtitle: "A partner you select",
    note: "Matched to intervention type and domain",
    icon: "◇",
    color: C.blue,
  },
] as const;

export function DecisionTree() {
  const [step, setStep] = useState<Step>("problem");
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const advance = (next: Step) => setStep(next);
  const select = (problem: string) => {
    setSelectedProblem(problem);
    setTimeout(() => advance("assess"), 400);
  };

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-5xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <Reveal>
          <h2 className="text-section font-semibold tracking-tight text-ink text-center">
            One business problem. The right path forward.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lead leading-relaxed text-muted">
            Compass doesn&apos;t start with AI. It starts with the problem, compares the available
            interventions, and determines the best path from decision to measured outcome.
          </p>
        </Reveal>

        <div className="mt-16">
          {/* ================================================================ */}
          {/* STEP 1: Problem selection                                        */}
          {/* ================================================================ */}
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-deep" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                Your business problem
              </span>
            </div>

            {step === "problem" ? (
              <Reveal>
                <p className="mb-8 text-[18px] font-semibold text-ink">What&apos;s the problem?</p>
                <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
                  {PROBLEMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => select(p.id)}
                      className="inline-flex items-center gap-2.5 rounded-lg border border-line bg-surface px-5 py-3 text-[14px] font-medium text-ink transition-all hover:border-ink/60 hover:shadow-sm"
                    >
                      <span className="text-[16px]">{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </Reveal>
            ) : (
              <p className="mb-8 text-[16px] font-medium text-ink">
                <span className="text-muted">Problem:</span>{" "}
                <span className="font-semibold" style={{ color: C.teal }}>
                  {PROBLEMS.find((p) => p.id === selectedProblem)?.label}
                </span>
              </p>
            )}
          </div>

          {/* ================================================================ */}
          {/* STEP 2: Compass assesses                                         */}
          {/* ================================================================ */}
          {["assess", "compare", "recommend", "execute", "measure", "learn"].includes(step) && (
            <Reveal>
              <div className="mt-8 text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.teal }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.teal }}>
                    Compass assesses
                  </span>
                </div>
                <p className="mb-4 text-[13px] text-muted">
                  Understand the workflow, economics, constraints, evidence, and risk
                </p>
                <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
                  {ASSESS_DIMS.map((dim) => (
                    <span
                      key={dim}
                      className="inline-flex items-center rounded-md border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ================================================================ */}
          {/* STEP 3: Compare interventions                                    */}
          {/* ================================================================ */}
          {["compare", "recommend", "execute", "measure", "learn"].includes(step) && (
            <Reveal delay={120}>
              <div className="mt-10 text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.gold }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.gold }}>
                    Compass compares
                  </span>
                </div>
                <p className="mb-6 text-[13px] text-muted">
                  Every viable intervention scored on the same evidence
                </p>

                <div className="mx-auto max-w-md space-y-3">
                  {INTERVENTIONS.map((inv) => (
                    <div
                      key={inv.id}
                      className={
                        inv.best
                          ? "relative overflow-hidden rounded-lg border-2 px-4 py-3 text-left transition-all"
                          : "relative overflow-hidden rounded-lg border border-line px-4 py-3 text-left transition-all"
                      }
                      style={{
                        backgroundColor: inv.best ? "#F0F7F6" : "transparent",
                        borderColor: inv.best ? C.teal : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13.5px] font-semibold text-ink">{inv.name}</span>
                        <span
                          className="text-[13.5px] font-bold"
                          style={{ color: inv.best ? C.teal : C.silver }}
                        >
                          {inv.score}
                          {inv.best && (
                            <span className="ml-1.5 text-[10px] uppercase tracking-wide">✓</span>
                          )}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-line">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: inv.width,
                            backgroundColor: inv.best ? C.teal : C.silver,
                            opacity: inv.best ? 1 : 0.5,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[11px] text-faint">
                  Illustrative example — not an actual recommendation.
                </p>

                {step === "compare" && (
                  <button
                    onClick={() => advance("recommend")}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
                  >
                    Why did automation win? →
                  </button>
                )}
              </div>
            </Reveal>
          )}

          {/* ================================================================ */}
          {/* STEP 4: Recommendation — why it won                              */}
          {/* ================================================================ */}
          {["recommend", "execute", "measure", "learn"].includes(step) && (
            <Reveal delay={160}>
              <div className="mt-10">
                <div className="mb-5 text-center">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.green }} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.green }}>
                      Recommended decision
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border px-5 py-5" style={{ borderColor: C.teal, backgroundColor: "#F0F7F6" }}>
                    <p className="text-[13px] font-bold uppercase tracking-wide" style={{ color: C.teal }}>
                      Automation wins
                    </p>
                    <ul className="mt-3 space-y-2">
                      {WHY_WINNING.map((reason) => (
                        <li key={reason} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink">
                          <span className="mt-[6px] text-[11px]" style={{ color: C.green }}>✓</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div
                      className="rounded-lg border border-line px-5 py-3.5"
                      style={{ borderLeft: `3px solid ${C.red}` }}
                    >
                      <p className="text-[12px] font-bold uppercase tracking-wide text-muted">AI</p>
                      <p className="mt-1 text-[13px] leading-snug text-muted">{WHY_NOT_AI}</p>
                    </div>
                    <div
                      className="rounded-lg border border-line px-5 py-3.5"
                      style={{ borderLeft: `3px solid ${C.red}` }}
                    >
                      <p className="text-[12px] font-bold uppercase tracking-wide text-muted">Staffing</p>
                      <p className="mt-1 text-[13px] leading-snug text-muted">{WHY_NOT_STAFFING}</p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] text-faint">
                  Compass makes the same recommendation regardless of who implements it.
                </p>

                {step === "recommend" && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => advance("execute")}
                      className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
                    >
                      How should it get implemented? →
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* ================================================================ */}
          {/* STEP 5: Execution paths                                          */}
          {/* ================================================================ */}
          {["execute", "measure", "learn"].includes(step) && (
            <Reveal delay={200}>
              <div className="mt-10 text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.blue }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.blue }}>
                    Choose execution path
                  </span>
                </div>
                <p className="mb-6 text-[13px] text-muted">
                  The decision is locked. Now choose how to implement it.
                </p>

                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                  {EXECUTION_PATHS.map((path) => (
                    <div
                      key={path.id}
                      className="rounded-lg border border-line bg-surface px-4 py-5 text-center"
                    >
                      <div
                        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full text-[18px]"
                        style={{ backgroundColor: `${path.color}15`, color: path.color }}
                      >
                        {path.icon}
                      </div>
                      <p className="text-[14px] font-semibold text-ink">{path.title}</p>
                      <p className="mt-1 text-[12px] font-medium" style={{ color: path.color }}>
                        {path.subtitle}
                      </p>
                      <p className="mt-2 text-[11px] leading-snug text-muted">{path.note}</p>
                    </div>
                  ))}
                </div>

                {step === "execute" && (
                  <button
                    onClick={() => advance("measure")}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
                  >
                    See the Command Center →
                  </button>
                )}
              </div>
            </Reveal>
          )}

          {/* ================================================================ */}
          {/* STEP 6: Measure                                                  */}
          {/* ================================================================ */}
          {["measure", "learn"].includes(step) && (
            <Reveal delay={240}>
              <div className="mt-10">
                <div className="mb-5 text-center">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.green }} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.green }}>
                      Command Center
                    </span>
                  </div>
                  <p className="mb-6 text-[13px] text-muted">
                    Compass stays to answer: &ldquo;Is the thing we approved actually producing the
                    business outcome we approved it for?&rdquo;
                  </p>
                </div>

                <div className="mx-auto max-w-lg rounded-lg border border-line bg-surface">
                  <div className="border-b border-line bg-paper px-5 py-3">
                    <p className="text-[12px] font-semibold text-ink">Expected vs. Actual</p>
                  </div>
                  <div className="divide-y divide-line">
                    {[
                      { label: "Expected annual value", expected: "$1.3M", actual: "$1.17M", color: C.teal },
                      { label: "Target automation", expected: "80%", actual: "74%", color: "#B45309" },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-3 px-5 py-3.5 text-[13px]">
                        <span className="font-medium text-ink">{row.label}</span>
                        <span className="text-center text-muted">{row.expected}</span>
                        <span className="text-center font-semibold" style={{ color: row.color }}>
                          {row.actual}
                        </span>
                      </div>
                    ))}
                    <div className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
                        style={{ backgroundColor: "#FEF3C7", color: "#B45309" }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Business case at risk
                      </span>
                    </div>
                  </div>
                </div>

                {step === "measure" && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => advance("learn")}
                      className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
                    >
                      What happens next? →
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* ================================================================ */}
          {/* STEP 7: Learn — outcome becomes evidence                          */}
          {/* ================================================================ */}
          {step === "learn" && (
            <Reveal delay={280}>
              <div className="mt-10 text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.gold }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: C.gold }}>
                    The learning loop
                  </span>
                </div>

                <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-ink">
                  The outcome becomes evidence. It feeds back into the evidence library, making the
                  next decision better.
                </p>

                <div className="mt-7">
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[24px]"
                    style={{ backgroundColor: `${C.teal}12`, color: C.teal }}
                  >
                    ↻
                  </div>
                </div>

                <p className="mt-5 text-[13px] font-medium" style={{ color: C.teal }}>
                  Better next decision
                </p>

                <button
                  onClick={() => setStep("problem")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 text-[13px] font-medium text-muted transition-colors hover:border-ink/40 hover:text-ink"
                >
                  Start over
                </button>
              </div>
            </Reveal>
          )}
        </div>

        {/* Philosophy note */}
        <Reveal>
          <div className="mx-auto mt-14 max-w-2xl rounded-lg border border-line bg-surface px-6 py-5 text-center">
            <p className="text-[12px] leading-relaxed text-muted">
              The decision engine produces a locked recommendation based on evidence, economics,
              and suitability. Execution path selection happens after the decision is made.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
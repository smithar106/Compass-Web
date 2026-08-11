"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

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
  "Volume", "Labor cost", "Exceptions", "Standardization", "Risk", "Budget", "Timeline",
] as const;

interface InterventionItem {
  id: string;
  name: string;
  score: number;
  color: string;
  width: string;
  best?: boolean;
}

const INTERVENTIONS: InterventionItem[] = [
  { id: "automation", name: "Automation", score: 91, color: C.teal, width: "91%", best: true },
  { id: "hybrid", name: "Hybrid", score: 81, color: C.silver, width: "81%" },
  { id: "process", name: "Process Redesign", score: 77, color: C.gold, width: "77%" },
  { id: "ai", name: "AI", score: 72, color: C.purple, width: "72%" },
  { id: "software", name: "Software", score: 68, color: C.blue, width: "68%" },
  { id: "staffing", name: "Staffing", score: 43, color: C.red, width: "43%" },
];

function Connector({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-2", className)}>
      <span aria-hidden="true" className="text-[10px] tracking-[0.3em] text-faint">▼</span>
    </div>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export function DecisionTree() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-4xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <Reveal>
          <h2 className="text-section font-semibold tracking-tight text-ink text-center">
            One business problem. The right path forward.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lead leading-relaxed text-muted">
            Compass doesn&apos;t start with AI. It starts with the problem, compares the available
            interventions, and determines the best path from decision to measured outcome.
          </p>
        </Reveal>

        <div className="mt-16 space-y-6">
          {/* ================================================================ */}
          {/* YOUR BUSINESS PROBLEM */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Your business problem" color={C.teal} />
              <p className="mt-3 text-[16px] font-semibold text-ink">What&apos;s the problem?</p>
              <div className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2">
                {PROBLEMS.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-[13px] font-medium text-ink"
                  >
                    <span className="text-[15px]">{p.icon}</span>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Connector />

          {/* ================================================================ */}
          {/* COMPASS ASSESSES */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Compass assesses" color={C.teal} />
              <p className="mt-3 text-[13px] text-muted">
                Understand the workflow, economics, constraints, evidence, and risk
              </p>
              <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
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

          <Connector />

          {/* ================================================================ */}
          {/* COMPASS COMPARES */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Compass compares" color={C.gold} />
              <p className="mt-3 text-[13px] text-muted">
                Every viable intervention scored on the same evidence
              </p>
              <div className="mx-auto mt-4 max-w-md space-y-2.5">
                {INTERVENTIONS.map((inv) => (
                  <div
                    key={inv.id}
                    className="relative overflow-hidden rounded-lg px-3 py-2.5 text-left transition-all"
                    style={{
                      border: inv.best ? `2px solid ${C.teal}` : "1px solid var(--color-line, #D0C9B8)",
                      backgroundColor: inv.best ? "#F0F7F6" : "transparent",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-ink">{inv.name}</span>
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: inv.best ? C.teal : C.silver }}
                      >
                        {inv.score}
                        {inv.best && (
                          <span className="ml-1.5 text-[10px] uppercase tracking-wide" style={{ color: C.green }}>
                            ✓
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-line">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: inv.width,
                          backgroundColor: inv.best ? C.teal : C.silver,
                          opacity: inv.best ? 1 : 0.4,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-faint">Illustrative example — not an actual recommendation.</p>
            </div>
          </Reveal>

          <Connector />

          {/* ================================================================ */}
          {/* RECOMMENDED DECISION */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Recommended decision" color={C.green} />
            </div>
            <div className="mx-auto mt-4 max-w-lg">
              <div
                className="rounded-lg border px-5 py-4"
                style={{ borderColor: C.teal, backgroundColor: "#F0F7F6" }}
              >
                <p className="text-[14px] font-bold uppercase tracking-wide" style={{ color: C.teal }}>
                  Why automation wins
                </p>
                <ul className="mt-3 space-y-1.5">
                  {["High transaction volume", "Highly standardized workflow", "Low exception rate", "Strong economics", "Relevant comparable implementations"].map(
                    (reason) => (
                      <li key={reason} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink">
                        <span className="mt-[5px] text-[11px]" style={{ color: C.green }}>✓</span>
                        {reason}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <p className="mt-3 text-center text-[11px] text-faint">
                Compass makes the same recommendation regardless of who implements it.
              </p>
            </div>
          </Reveal>

          <Connector />

          {/* ================================================================ */}
          {/* EXECUTION PATHS */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Choose execution path" color={C.blue} />
              <p className="mt-3 text-[13px] text-muted">
                The decision is locked. Now choose how to implement it.
              </p>
              <div className="mx-auto mt-4 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                <div
                  className="rounded-lg border border-line bg-surface px-4 py-4 text-center"
                  style={{ borderLeft: `3px solid ${C.silver}` }}
                >
                  <p className="text-[14px] font-semibold text-ink">Your Team</p>
                  <p className="mt-1 text-[12px] font-medium" style={{ color: C.silver }}>Implement internally</p>
                  <p className="mt-2 text-[11px] leading-snug text-muted">Full plan and success criteria provided</p>
                </div>
                <div
                  className="rounded-lg border border-line bg-surface px-4 py-4 text-center"
                  style={{ borderLeft: `3px solid ${C.blue}` }}
                >
                  <p className="text-[14px] font-semibold text-ink">Implementation Partner</p>
                  <p className="mt-1 text-[12px] font-medium" style={{ color: C.blue }}>A partner you select</p>
                  <p className="mt-2 text-[11px] leading-snug text-muted">Matched to intervention type and domain</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Connector />

          {/* ================================================================ */}
          {/* COMMAND CENTER */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Measure" color={C.green} />
              <p className="mt-3 text-[13px] text-muted">
                Compass stays to answer: did this produce the value we approved it for?
              </p>

              <div className="mx-auto mt-4 max-w-sm rounded-lg border border-line bg-surface">
                <div className="border-b border-line bg-paper px-5 py-2.5">
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
                </div>
              </div>
            </div>
          </Reveal>

          <Connector />

          {/* ================================================================ */}
          {/* LEARNING LOOP */}
          {/* ================================================================ */}
          <Reveal>
            <div className="text-center">
              <Pill label="Learn" color={C.gold} />
              <p className="mt-3 text-[14px] leading-relaxed text-ink">
                The outcome becomes evidence. It feeds into the evidence library, making the
                next decision better.
              </p>
              <div className="mt-4">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[20px]"
                  style={{ backgroundColor: `${C.teal}12`, color: C.teal }}
                >
                  ↻
                </span>
              </div>
              <p className="mt-3 text-[13px] font-medium" style={{ color: C.teal }}>
                Better next decision
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mx-auto mt-14 max-w-lg rounded-lg border border-line bg-surface px-6 py-5 text-center">
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
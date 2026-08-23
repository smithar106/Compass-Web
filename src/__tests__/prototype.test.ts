import { describe, it, expect } from "vitest";
import { PROBLEM_LIBRARY, problemById } from "@/data/prototype/problems";
import { DECISION_LIBRARY, decisionById } from "@/data/prototype/decisions";
import { resolveDecision, allDecisions, allProblems } from "@/lib/prototype/recommendation";

describe("Prototype problem library", () => {
  it("has exactly the ten specified problems", () => {
    expect(PROBLEM_LIBRARY).toHaveLength(10);
    expect(PROBLEM_LIBRARY.map((p) => p.name)).toEqual([
      "Slow customer onboarding",
      "Too much manual invoice processing",
      "Support requests routed incorrectly",
      "Knowledge trapped across documents",
      "Sales-to-implementation rework",
      "Too much repetitive reporting",
      "Escalations identified too late",
      "Forecasting requires too much manual work",
      "Teams can't find accurate information",
      "New employees take too long to become productive",
    ]);
  });

  it("every problem has at least three context questions with options", () => {
    for (const p of PROBLEM_LIBRARY) {
      expect(p.context.length).toBeGreaterThanOrEqual(3);
      for (const q of p.context) {
        expect(q.options.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

describe("Prototype decision library", () => {
  it("has one complete decision per problem", () => {
    expect(DECISION_LIBRARY).toHaveLength(10);
    const problemIds = new Set(PROBLEM_LIBRARY.map((p) => p.id));
    for (const d of DECISION_LIBRARY) {
      expect(problemIds.has(d.id)).toBe(true);
    }
  });

  it("every decision has the full decision schema populated", () => {
    for (const d of DECISION_LIBRARY) {
      expect(d.recommendation.length).toBeGreaterThan(10);
      expect(d.strategy.length).toBeGreaterThan(10);
      expect(d.decisionSummary.length).toBeGreaterThan(60);
      expect(d.whyThis.length).toBeGreaterThanOrEqual(3);
      expect(d.impactMetrics.length).toBeGreaterThanOrEqual(3);
      // Comparable examples must read as declarative statements a board can hear.
      expect(d.comparableExamples.length).toBeGreaterThanOrEqual(2);
      for (const ex of d.comparableExamples) {
        expect(ex.statement.endsWith(".")).toBe(true);
        expect(ex.statement.length).toBeGreaterThan(40);
      }
      expect(d.alternatives.length).toBeGreaterThanOrEqual(2);
      for (const a of d.alternatives) {
        expect(a.whyRankedLower.length).toBeGreaterThan(5);
      }
      expect(d.implementationPlan).toHaveLength(4);
      expect(d.implementationPlan.map((p) => p.phase)).toEqual([
        "Validate",
        "Pilot",
        "Deploy",
        "Measure",
      ]);
      expect(d.risks.length).toBeGreaterThanOrEqual(2);
      expect(d.measurement.validationPoints).toHaveLength(3);
      expect(d.whatWouldChangeThis.length).toBeGreaterThanOrEqual(2);
      expect(d.assumptions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("decision briefs do not expose tool mechanics in presentable fields", () => {
    for (const d of DECISION_LIBRARY) {
      const presentable = [
        d.recommendation,
        d.strategy,
        d.decisionSummary,
        ...d.whyThis,
        ...d.comparableExamples.map((e) => e.statement),
        ...d.alternatives.map((a) => a.whyRankedLower),
      ].join(" ");
      // A CEO would never present tool internals: evidence counts, tiers,
      // provenance, or "ranked lower" framing. Business words like "scoring"
      // (predictive scoring) are fine and expected.
      expect(presentable).not.toMatch(/comparable implementation/i);
      expect(presentable).not.toMatch(/evidence tier|evidence strength|evidence profile/i);
      expect(presentable).not.toMatch(/illustrative|provenance/i);
      expect(presentable).not.toMatch(/ranked lower|ranks below|alternative.*rank/i);
    }
  });
});

describe("Deterministic recommendation layer", () => {
  it("resolves every problem deterministically", () => {
    for (const p of PROBLEM_LIBRARY) {
      const a = resolveDecision(p.id);
      const b = resolveDecision(p.id);
      expect(a).not.toBeNull();
      expect(a?.decision.id).toBe(p.id);
      // Same input → same output.
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
  });

  it("applies context tuning deterministically and labels it illustrative", () => {
    const problem = problemById("slow-customer-onboarding");
    expect(problem).toBeTruthy();
    const answers = [
      { questionId: "org-size", value: "2,000+" },
      { questionId: "primary-objective", value: "Faster time-to-value" },
    ];
    const resolved = resolveDecision(problem!.id, answers);
    expect(resolved).not.toBeNull();
    expect(resolved!.tuning.note).toContain("Illustrative");
  });

  it("exposes all decisions and problems for list grids", () => {
    expect(allDecisions()).toHaveLength(10);
    expect(allProblems()).toHaveLength(10);
    expect(decisionById("manual-invoice-processing")?.recommendation).toContain("invoice");
  });

  it("returns null for an unknown problem", () => {
    expect(resolveDecision("not-a-real-problem")).toBeNull();
    expect(decisionById("not-a-real-problem")).toBeUndefined();
    expect(problemById("not-a-real-problem")).toBeUndefined();
  });
});

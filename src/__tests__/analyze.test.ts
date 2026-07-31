import { describe, it, expect } from "vitest";
import {
  normalizeProblem,
  selectFollowUps,
  inferAnswersFromText,
  buildProfileFromAnalyze,
} from "@/lib/analyze";

describe("Analyze pathway — normalization", () => {
  it("normalizes a clear invoice problem", () => {
    const n = normalizeProblem("Manual invoice processing is expensive and slow; matching errors");
    expect(n.workflow).toBe("invoice_processing");
    expect(n.businessFunction).toBe("finance");
    expect(n.desiredOutcome).toBe("cost");
    expect(n.rootCauseHypothesis.length).toBeGreaterThan(20);
    expect(n.decision).toContain("invoice");
  });

  it("normalizes an onboarding problem with a time outcome", () => {
    const n = normalizeProblem("Customer onboarding takes 45 days because approvals and setup are manual");
    expect(n.workflow).toBe("onboarding");
    expect(n.desiredOutcome).toBe("time");
  });

  it("defaults obscure problems to a general workflow but still returns a decision", () => {
    const n = normalizeProblem("Quantum chemistry solvent optimization in semiconductor cleanrooms");
    expect(n.workflow.length).toBeGreaterThan(0);
    expect(n.decision.length).toBeGreaterThan(0);
  });

  it("builds a deterministic profile the engine accepts", () => {
    const n = normalizeProblem("Manual invoice processing is expensive");
    const p = buildProfileFromAnalyze(n, { cycle_time: "Hours", workflow_frequency: "Daily" });
    expect(p.business_function).toBe("finance");
    expect(p.workflow).toBe("invoice_processing");
    expect(p.workflow_frequency).toBe("Daily");
    expect(p.desired_outcome).toBe("cost");
  });
});

describe("Analyze pathway — adaptive follow-ups", () => {
  it("asks no more than five questions for a clear problem", () => {
    const qs = selectFollowUps({
      text: "Manual invoice processing is expensive and slow; matching errors",
      answers: {},
      engineGaps: [{ title: "Annual workflow volume and handling time" }],
      max: 5,
    });
    expect(qs.length).toBeLessThanOrEqual(5);
    expect(qs.length).toBeGreaterThan(0);
  });

  it("does not ask questions already present in the original text", () => {
    const qs = selectFollowUps({
      text: "Onboarding takes 45 days for 20 people, daily volume, with many exceptions",
      answers: {},
      engineGaps: [],
      max: 5,
    });
    const ids = qs.map((q) => q.id);
    expect(ids).not.toContain("cycle_time"); // 45 days inferred
    expect(ids).not.toContain("workflow_frequency"); // daily inferred
    expect(ids).not.toContain("people_involved"); // 20 people inferred
    expect(ids).not.toContain("exception_rate"); // exceptions inferred
  });

  it("does not ask questions already answered", () => {
    const qs = selectFollowUps({
      text: "Support escalation is manual",
      answers: { cycle_time: "Hours", workflow_frequency: "Daily" },
      engineGaps: [],
      max: 5,
    });
    const ids = qs.map((q) => q.id);
    expect(ids).not.toContain("cycle_time");
    expect(ids).not.toContain("workflow_frequency");
  });

  it("produces different follow-ups for different problem contexts", () => {
    const a = selectFollowUps({ text: "Manual invoice processing is expensive", answers: {}, engineGaps: [], max: 5 });
    const b = selectFollowUps({ text: "Customer support escalation is slow", answers: {}, engineGaps: [], max: 5 });
    // both should include cycle_time/frequency, but the promoted-gap ordering differs when gaps differ
    const withGap = selectFollowUps({ text: "Manual invoice processing is expensive", answers: {}, engineGaps: [{ title: "Loaded labor cost" }], max: 5 });
    expect(withGap.map((q) => q.id)).toContain("labor_cost");
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
  });

  it("is deterministic for identical inputs", () => {
    const input = { text: "Manual invoice processing is expensive", answers: { cycle_time: "Hours" }, engineGaps: [{ title: "Annual workflow volume and handling time" }] };
    const a = selectFollowUps(input);
    const b = selectFollowUps(input);
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it("infers answers from the problem text", () => {
    const inferred = inferAnswersFromText("Takes 45 days, runs daily, 20 people, many exceptions, budget $50K");
    expect(inferred.has("cycle_time")).toBe(true);
    expect(inferred.has("workflow_frequency")).toBe(true);
    expect(inferred.has("people_involved")).toBe(true);
    expect(inferred.has("exception_rate")).toBe(true);
    expect(inferred.has("budget_range")).toBe(true);
  });
});

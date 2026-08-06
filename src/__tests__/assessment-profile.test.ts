import { describe, it, expect } from "vitest";
import { buildProfile } from "@/lib/assessment-profile";

describe("buildProfile", () => {
  it("should map dept to business function, workflow, and industry", () => {
    const p = buildProfile([
      { questionId: "dept", value: "Finance" },
      { questionId: "situation", value: "Manual invoice reconciliation" },
    ]);
    expect(p.business_function).toBe("finance");
    expect(p.workflow).toBe("invoice_processing");
    expect(p.industry).toBe("financial_services");
    expect(p.problem_statement).toBe("Manual invoice reconciliation");
  });

  it("should map desired outcome phrases to canonical keys", () => {
    expect(buildProfile([{ questionId: "desired-outcome", value: "Cost reduction" }]).desired_outcome).toBe("cost");
    expect(buildProfile([{ questionId: "desired-outcome", value: "Revenue growth" }]).desired_outcome).toBe("revenue");
    expect(buildProfile([{ questionId: "desired-outcome", value: "Time savings" }]).desired_outcome).toBe("time");
    expect(buildProfile([{ questionId: "desired-outcome", value: "Something else" }]).desired_outcome).toBe("efficiency");
  });

  it("should default missing fields safely", () => {
    const p = buildProfile([]);
    expect(p.business_function).toBe("operations");
    expect(p.workflow).toBe("process_automation");
    expect(p.industry).toBe("professional_services");
    expect(p.problem_statement).toBe("Operations ops optimization");
    expect(p.desired_outcome).toBe("efficiency");
    expect(p.workflow_frequency).toBe("");
  });

  it("should pass through scale, risk, and frequency answers", () => {
    const p = buildProfile([
      { questionId: "frequency", value: "Daily" },
      { questionId: "risk", value: "High — significant revenue or compliance risk" },
      { questionId: "people", value: "4–10" },
    ]);
    expect(p.workflow_frequency).toBe("Daily");
    expect(p.business_risk).toContain("High");
    expect(p.people_involved).toBe("4–10");
  });

  it("should derive dollar-impact inputs from volume, handling time, and cost", () => {
    const p = buildProfile([
      { questionId: "volume", value: "5,000–20,000" },
      { questionId: "handling-time", value: "30–60 minutes" },
      { questionId: "loaded-cost", value: "$50–$100" },
    ]);
    expect(p.annual_workflow_volume).toBe("150000"); // 12,500/mo midpoint × 12
    expect(p.current_handling_time).toBe("0.75"); // 45 min midpoint in hours
    expect(p.loaded_labor_cost).toBe("75"); // $75/hr midpoint
  });

  it("should leave dollar-impact inputs empty when not collected", () => {
    const p = buildProfile([{ questionId: "dept", value: "Finance" }]);
    expect(p.annual_workflow_volume).toBe("");
    expect(p.current_handling_time).toBe("");
    expect(p.loaded_labor_cost).toBe("");
  });

  it("should parse boundary volume and cost options", () => {
    const p = buildProfile([
      { questionId: "volume", value: "Under 1,000" },
      { questionId: "handling-time", value: "1–2 hours" },
      { questionId: "loaded-cost", value: "Over $200" },
    ]);
    expect(p.annual_workflow_volume).toBe("6000"); // 500/mo × 12
    expect(p.current_handling_time).toBe("1.5"); // hours handled directly
    expect(p.loaded_labor_cost).toBe("250"); // 1.25 × $200
  });
});

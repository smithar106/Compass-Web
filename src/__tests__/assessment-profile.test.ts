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
});

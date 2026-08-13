import { describe, it, expect } from "vitest";
import { generateProposedSuccessCriteria, finalizeOutcomeContract, evaluateOutcome } from "@/lib/outcome-contract";

describe("Outcome Contract & Success Criteria", () => {
  const mockRec = {
    title: "Automated Invoice Matching",
    impact: {
      annual_savings: { expected: 310000 },
      implementation_timeline: { expected_weeks: 10 },
    },
    outcome_ranges: [{ metric_label: "Processing cost per invoice" }],
    assumptions_detail: [{ title: "Volume stays stable" }],
  };

  it("generates proposed success criteria without fabricating baselines", () => {
    const criteria = generateProposedSuccessCriteria(mockRec, { workflow: "invoice_processing" });
    expect(criteria.primary_success_metric).toBe("Processing cost per invoice");
    expect(criteria.current_baseline).toContain("Customer confirmation required");
    expect(criteria.target).toContain("$310K");
  });

  it("finalizes an immutable versioned outcome contract upon approval", () => {
    const criteria = generateProposedSuccessCriteria(mockRec, {});
    const contract = finalizeOutcomeContract("dec_001", mockRec, criteria);
    expect(contract.version).toBe(1);
    expect(contract.outcome_state).toBe("pending");
    expect(contract.decision_id).toBe("dec_001");
  });

  it("evaluates outcome state as inconclusive when evidence lacks system verification", () => {
    const criteria = generateProposedSuccessCriteria(mockRec, {});
    const contract = finalizeOutcomeContract("dec_001", mockRec, criteria);
    const state = evaluateOutcome(contract, [
      { metric_name: "cost", value: 30, timestamp: "2026-08-13", source: "human", collection_method: "human_reported", verification_status: "unverified" },
    ]);
    expect(state).toBe("inconclusive");
  });

  it("evaluates outcome state as successful when verified measurements are present", () => {
    const criteria = generateProposedSuccessCriteria(mockRec, {});
    const contract = finalizeOutcomeContract("dec_001", mockRec, criteria);
    const state = evaluateOutcome(contract, [
      { metric_name: "cost", value: 30, timestamp: "2026-08-13", source: "ERP", collection_method: "api_webhook", verification_status: "system_observed" },
    ]);
    expect(state).toBe("successful");
  });
});

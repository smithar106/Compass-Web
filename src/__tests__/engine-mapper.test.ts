import { describe, it, expect } from "vitest";
import { mapEngineToDecision } from "@/lib/prototype/engine-mapper";
import { structuredProblem } from "@/lib/prototype/problem-definitions";

const SAMPLE_RESPONSE = {
  recommendations: [
    {
      rank: 1,
      title: "Automated invoice matching with exception-based review",
      category: "Workflow_Automation",
      specific_action:
        "Automate the reliable match path and keep humans on the ambiguous exceptions.",
      confidence: { score: 0.82, label: "high" },
      evidence_summary: { overall_tier: "gold", total_comparables: 12 },
      why_ranked_first: {
        summary: "Automated invoice matching ranks first on evidence quality and workflow fit.",
        supporting_reasons: [
          "12 comparable implementations reported measurable outcomes",
          "Deterministic matching is auditable and low-risk",
        ],
      },
      alternatives_considered: [
        { family: "AI Implementation", reason: "Thinner evidence; exception risk uncontrolled" },
      ],
      risks: [{ title: "Exception queue bottleneck", explanation: "If exceptions are not the minority, the queue stalls.", mitigation: "Pilot first." }],
      assumptions_detail: [{ title: "Invoice volume justifies automation" }],
      information_gaps: [{ title: "Supplier data quality", explanation: "PO data completeness is unverified" }],
      next_validation_step: { action: "Measure baseline", duration: "Weeks 1–3", success_criteria: "Match rate > 80%" },
      comparable_implementations: [
        {
          organization: "REVA Air Ambulance",
          intervention: "Ramp Bill Pay implementation",
          outcome_summary: "Processing time 83% improvement",
          normalized_metrics: [{ metric: "Processing time", value: "83%" }],
        },
        {
          organization: "NHS Shared Business Services",
          intervention: "Migration of financial systems to Oracle Cloud",
          outcome_summary: "Invoices processed faster",
        },
        {
          organization: "Cetera Financial Group",
          intervention: "Oracle Cloud ERP Transformation",
          outcome_summary: "Legacy systems consolidated 100%",
        },
        {
          organization: "Example Retailer",
          intervention: "Automated AP workflow",
          outcome_summary: "Invoice cycle time cut 60%",
        },
        {
          organization: "Example Manufacturer",
          intervention: "Invoice matching automation",
          outcome_summary: "Cost per invoice down 45%",
        },
      ],
    },
  ],
  impact_summary: { headline: "40–60% lower processing cost" },
};

describe("engine-mapper", () => {
  it("maps a live engine response to a PrototypeDecision", () => {
    const problem = structuredProblem("manual-invoice-processing");
    expect(problem).toBeTruthy();
    const decision = mapEngineToDecision(problem!, SAMPLE_RESPONSE);

    expect(decision.decisionStatus).toBe("defensible");
    expect(decision.recommendation).toBe("Automated invoice matching with exception-based review");
    expect(decision.comparableExamples.length).toBe(3);
    expect(decision.comparableExamples[0].statement).toContain("REVA Air Ambulance");
    expect(decision.comparableExamples[0].statement).toContain("Processing time");
    // No tool-mechanics in presentable fields.
    expect(decision.comparableExamples[0].statement).not.toMatch(/comparable implementation/i);
    expect(decision.whyThis.length).toBeGreaterThanOrEqual(2);
    expect(decision.alternatives.length).toBeGreaterThanOrEqual(1);
    expect(decision.impactMetrics.length).toBeGreaterThanOrEqual(1);
  });

  it("produces an honest needs_more_evidence decision for thin evidence", () => {
    const problem = structuredProblem("manual-invoice-processing");
    const thin = { ...SAMPLE_RESPONSE, recommendations: [{ ...SAMPLE_RESPONSE.recommendations[0], comparable_implementations: [] }] };
    const decision = mapEngineToDecision(problem!, thin);
    expect(decision.decisionStatus).toBe("needs_more_evidence");
    expect(decision.comparableExamples).toHaveLength(0);
    expect(decision.decisionSummary).toContain("not enough for a fully defensible recommendation");
  });

  it("covers all 10 structured problems with minCitable configured", () => {
    const ids = [
      "slow-customer-onboarding", "manual-invoice-processing", "misrouted-support",
      "trapped-knowledge", "sales-handoff-rework", "repetitive-reporting",
      "late-escalations", "manual-forecasting", "hard-to-find-information",
      "slow-employee-ramp",
    ];
    for (const id of ids) {
      const p = structuredProblem(id);
      expect(p, `missing structured problem ${id}`).toBeTruthy();
      expect(p!.workflow.length).toBeGreaterThan(0);
      expect(p!.businessFunction.length).toBeGreaterThan(0);
      expect(p!.minCitable).toBeGreaterThan(0);
    }
  });
});

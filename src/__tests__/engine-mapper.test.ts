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

  it("carries the fail-closed evidence mode from the engine", () => {
    const problem = structuredProblem("manual-invoice-processing");
    const exploratory = { ...SAMPLE_RESPONSE, evidence_mode: "exploratory", recommendations: [{ ...SAMPLE_RESPONSE.recommendations[0], evidence_mode: "exploratory", claim_kind: "hypothesis" }] };
    const d1 = mapEngineToDecision(problem!, exploratory as any);
    expect(d1.evidenceMode).toBe("exploratory");
    expect(d1.claimKind).toBe("hypothesis");

    const insufficient = { ...SAMPLE_RESPONSE, evidence_mode: "insufficient", recommendations: [{ ...SAMPLE_RESPONSE.recommendations[0], evidence_mode: "insufficient" }] };
    const d2 = mapEngineToDecision(problem!, insufficient as any);
    expect(d2.evidenceMode).toBe("insufficient");
  });

  it("never reports verified unless the engine says verified", () => {
    const problem = structuredProblem("manual-invoice-processing");
    // Engine omits evidence_mode (legacy) → must default to exploratory, never verified.
    const d = mapEngineToDecision(problem!, SAMPLE_RESPONSE as any);
    expect(d.evidenceMode).not.toBe("verified");
  });

  it("attaches a source citation to each impact metric", () => {
    const problem = structuredProblem("manual-invoice-processing");
    const withCitation = {
      ...SAMPLE_RESPONSE,
      recommendations: [
        {
          ...SAMPLE_RESPONSE.recommendations[0],
          comparable_implementations: [
            {
              organization: "Acme Corp",
              intervention: "Invoice automation",
              outcome_summary: "cost down",
              record_id: "rec-1",
              source_title: "Acme 10-K",
              source_url: "https://www.sec.gov/x",
              supporting_passage: "invoice processing cost reduced 40%",
              verification_status: "claim_verified",
              comparability: "direct_implementation",
              outcome_attribution: "explicit",
              supports_direct_outcome: true,
              normalized_metrics: [{ metric: "Processing time", value: "83%" }],
            },
          ],
        },
      ],
    };
    const d = mapEngineToDecision(problem!, withCitation as any);
    expect(d.impactMetrics.length).toBeGreaterThanOrEqual(1);
    const cit = d.impactMetrics[0].citation;
    expect(cit).toBeTruthy();
    expect(cit!.sourceUrl).toBe("https://www.sec.gov/x");
    expect(cit!.recordId).toBe("rec-1");
    expect(cit!.supportsDirectOutcome).toBe(true);
    expect(cit!.comparability).toBe("direct_implementation");
  });

  it("marks a non-direct citation as not supporting a direct outcome", () => {
    const problem = structuredProblem("manual-invoice-processing");
    const ctxOnly = {
      ...SAMPLE_RESPONSE,
      recommendations: [
        {
          ...SAMPLE_RESPONSE.recommendations[0],
          comparable_implementations: [
            {
              organization: "Provider Co",
              record_id: "rec-2",
              source_url: "https://www.sec.gov/y",
              verification_status: "claim_verified",
              comparability: "indirect_contextual",
              outcome_attribution: "none",
              supports_direct_outcome: false,
              attribution_limitation: "Indirect context only — does not document this intervention.",
              normalized_metrics: [{ metric: "Scale", value: "10M" }],
            },
          ],
        },
      ],
    };
    const d = mapEngineToDecision(problem!, ctxOnly as any);
    const cit = d.impactMetrics[0].citation!;
    expect(cit.supportsDirectOutcome).toBe(false);
    expect(cit.limitation).toContain("Indirect context");
  });
});

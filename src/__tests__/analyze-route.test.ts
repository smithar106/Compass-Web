import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/analyze/route";

const engineResponse = {
  recommendation_id: "abc-123",
  methodology: {
    evidence_count: {
      comparable_implementations: 69,
      unique_organizations: 63,
      outcome_measured_implementations: 17,
      quantified_outcome_implementations: 13,
    },
  },
  assessment_summary: { problem_statement: "Manual invoice processing is expensive" },
  recommendations: [
    {
      rank: 1,
      category: "Workflow_Automation",
      title: "Workflow Automation",
      confidence: { score: 0.65, label: "moderate", explanation: "" },
      evidence_summary: { overall_tier: "silver", total_comparables: 3, gold_count: 0, silver_count: 3, bronze_count: 0, average_evidence_score: 47 },
      outcome_ranges: [{ metric_label: "cycle time", directly_comparable: true, low: 25, high: 40, sample_size: 3 }],
      comparable_implementations: [],
      risks: [],
      alternatives_considered: [{ family: "AI", reason: "2 comparables" }],
      information_gaps: [{ title: "Annual workflow volume and handling time", explanation: "", effect_on_confidence: "" }],
      assumptions_detail: [],
      next_validation_step: { action: "Measure a 4-week baseline", purpose: "", owner: "", duration: "", success_criteria: "", decision_enabled: "" },
    },
  ],
};

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze", () => {
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    vi.stubEnv("COMPASS_API_URL", "http://engine.test");
    (globalThis as any).fetch = async () => ({ ok: true, json: async () => engineResponse });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    (globalThis as any).fetch = originalFetch;
  });

  it("normalizes, queries the live graph, and returns ≤5 targeted questions", async () => {
    const res = await POST(makeRequest({ problem_text: "Manual invoice processing is expensive" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.normalization.workflow).toBe("invoice_processing");
    expect(data.questions.length).toBeLessThanOrEqual(5);
    expect(data.decision.recommendations[0].title).toBe("Workflow Automation");
    expect(data.status).toBe("preliminary_result");
  });

  it("never sends users into the 14-question assessment and skips answered questions", async () => {
    const res = await POST(
      makeRequest({
        problem_text: "Onboarding takes 45 days for 20 people, daily volume",
        answers: { exception_rate: "Many (10-30%)" },
      })
    );
    const data = await res.json();
    const ids = data.questions.map((q: { id: string }) => q.id);
    expect(ids).not.toContain("cycle_time");
    expect(ids).not.toContain("workflow_frequency");
    expect(ids).not.toContain("people_involved");
    expect(ids).not.toContain("exception_rate");
    expect(data.questions.length).toBeLessThanOrEqual(5);
  });

  it("applies confirm-step edits to the normalization", async () => {
    const res = await POST(
      makeRequest({ problem_text: "Support is slow", edits: { workflow: "ticketing", businessFunction: "support" } })
    );
    const data = await res.json();
    expect(data.normalization.workflow).toBe("ticketing");
  });

  it("returns an honest insufficient_evidence status when the engine has no evidence", async () => {
    (globalThis as any).fetch = async () => ({
        ok: true,
        json: async () => ({
          recommendation_id: "y",
          methodology: {},
          assessment_summary: {},
          recommendations: [
            {
              rank: 1,
              title: "Additional Recommendation",
              confidence: { score: 0, label: "insufficient", explanation: "" },
              evidence_summary: { overall_tier: "insufficient", total_comparables: 0, gold_count: 0, silver_count: 0, bronze_count: 0, average_evidence_score: 0 },
              outcome_ranges: [],
              comparable_implementations: [],
              risks: [],
              alternatives_considered: [],
              information_gaps: [],
              assumptions_detail: [],
              next_validation_step: null,
            },
          ],
        }),
      });
    
    const res = await POST(makeRequest({ problem_text: "Quantum chemistry solvent optimization" }));
    const data = await res.json();
    expect(data.status).toBe("insufficient_evidence");
  });
});

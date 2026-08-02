import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/analyze/route";

const sessionCreate = {
  analysis_id: "sess-1",
  normalization: {
    workflow: "invoice_processing",
    businessFunction: "finance",
    problemStatement: "Manual invoice processing is expensive",
    rootCauseHypothesis: "Manual receipt, validation, and matching steps.",
    desiredOutcome: "cost",
    decision: "Which intervention best improves cost for invoice processing?",
  },
  questions: [{ id: "cycle_time", question: "What is the current cycle time per item?", why: "", factor: "Outcome evidence", type: "choice", options: ["Hours"], required: true }],
  status: "awaiting_answers",
};

const engineResponse = {
  recommendation_id: "abc-123",
  methodology: { evidence_count: { comparable_implementations: 69, unique_organizations: 63 } },
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
      alternatives_considered: [],
      information_gaps: [{ title: "Annual workflow volume and handling time", explanation: "", effect_on_confidence: "" }],
      assumptions_detail: [],
      next_validation_step: { action: "Measure baseline", purpose: "", owner: "", duration: "", success_criteria: "", decision_enabled: "" },
    },
  ],
};

interface Call {
  url: string;
  body: any;
}

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze (thin client proxy)", () => {
  const originalFetch = globalThis.fetch;
  let calls: Call[] = [];
  let sessionsAvailable = true;
  let sessionStatus = "awaiting_answers";

  beforeEach(() => {
    vi.stubEnv("COMPASS_API_URL", "http://engine.test");
    calls = [];
    sessionsAvailable = true;
    sessionStatus = "awaiting_answers";
    (globalThis as any).fetch = async (input: any, init?: any) => {
      const url = String(input);
      let body: any = {};
      try {
        body = init?.body ? JSON.parse(String(init.body)) : {};
      } catch {}
      calls.push({ url, body });
      if (url.includes("/api/recommendations")) {
        return { ok: true, status: 200, json: async () => engineResponse };
      }
      if (url.includes("/api/analyze") && !sessionsAvailable) {
        return { ok: false, status: 404, json: async () => ({}) };
      }
      return { ok: true, status: 200, json: async () => ({ ...sessionCreate, status: sessionStatus }) };
    };
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    (globalThis as any).fetch = originalFetch;
  });

  it("proxies create to the engine session endpoint and returns the engine state", async () => {
    const res = await POST(makeRequest({ action: "create", problem_text: "Manual invoice processing is expensive" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(calls[0].url).toContain("/api/analyze");
    expect(data.analysis_id).toBe("sess-1");
    expect(data.normalization.workflow).toBe("invoice_processing");
    expect(data.questions.length).toBeLessThanOrEqual(5);
  });

  it("forwards confirm edits to the engine confirm endpoint", async () => {
    const res = await POST(makeRequest({ action: "confirm", analysis_id: "sess-1", edits: { desiredOutcome: "time" } }));
    expect(res.status).toBe(200);
    const confirmCall = calls.find((c) => c.url.endsWith("/confirm"));
    expect(confirmCall).toBeTruthy();
    expect(confirmCall!.body.edits.desiredOutcome).toBe("time");
  });

  it("forwards answers to the engine answers endpoint", async () => {
    const res = await POST(makeRequest({ action: "answers", analysis_id: "sess-1", answers: { cycle_time: "Hours" } }));
    expect(res.status).toBe(200);
    const answersCall = calls.find((c) => c.url.endsWith("/answers"));
    expect(answersCall).toBeTruthy();
    expect(answersCall!.body.answers.cycle_time).toBe("Hours");
  });

  it("passes an honest insufficient status through from the engine", async () => {
    sessionStatus = "insufficient_evidence";
    const res = await POST(makeRequest({ action: "create", problem_text: "Quantum chemistry solvent optimization" }));
    const data = await res.json();
    expect(data.status).toBe("insufficient_evidence");
  });

  it("falls back to web orchestration when the engine session endpoints are unavailable", async () => {
    sessionsAvailable = false;
    const res = await POST(makeRequest({ action: "create", problem_text: "Manual invoice processing is expensive" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    // fallback normalizes locally and queries /api/recommendations
    expect(calls.some((c) => c.url.includes("/api/recommendations"))).toBe(true);
    expect(data.normalization.workflow).toBe("invoice_processing");
    expect(data.questions.length).toBeLessThanOrEqual(5);
    expect(data.status).toBe("preliminary_result");
  });

  it("maps fast-intake selections to a workflow without free text", async () => {
    const res = await POST(makeRequest({
      action: "intake",
      department: "Finance",
      problem: "Manual invoice processing",
      people: "100–250",
      outcome: "Reduce cost",
      timeline: "90 days",
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(calls.some((c) => c.url.includes("/api/recommendations"))).toBe(true);
    expect(data.normalization.workflow).toBe("invoice_processing");
    expect(data.normalization.businessFunction).toBe("finance");
    expect(data.normalization.desiredOutcome).toBe("cost");
    expect(data.questions).toHaveLength(0);
    expect(data.status).toBe("decision_ready");
    expect(data.intake).toMatchObject({ department: "Finance", problem: "Manual invoice processing" });
  });

  it("rejects an unknown fast-intake problem", async () => {
    const res = await POST(makeRequest({ action: "intake", department: "Finance", problem: "Not a real problem" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Unknown problem");
  });
});

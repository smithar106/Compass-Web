import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getDecision } from "@/app/api/decisions/[decision_id]/route";
import { POST as saveDecision } from "@/app/api/decisions/[decision_id]/save/route";
import { POST as implementDecision } from "@/app/api/decisions/[decision_id]/implement/route";
import { GET as getPartners } from "@/app/api/partners/route";
import { GET as getPlan } from "@/app/api/implementations/[implementation_id]/route";
import { POST as requestPartner } from "@/app/api/implementations/[implementation_id]/request/route";
import { GET as getInvite } from "@/app/api/implementations/[implementation_id]/invite/[token]/route";
import { POST as acceptInvite } from "@/app/api/implementations/[implementation_id]/invite/[token]/accept/route";

const analysisResponse = {
  analysis_id: "sess-1",
  normalization: { problemStatement: "Manual invoice processing is expensive", decision: "Which intervention best improves cost?" },
  questions: [],
  status: "decision_ready",
  decision: {
    recommendation_id: "abc-123",
    methodology: {},
    assessment_summary: {},
    recommendations: [
      {
        rank: 1,
        category: "Workflow_Automation",
        title: "Workflow Automation",
        confidence: { score: 0.65, label: "moderate", explanation: "" },
        evidence_summary: { overall_tier: "silver", total_comparables: 3 },
        outcome_ranges: [],
        risks: [],
        information_gaps: [],
        next_validation_step: { action: "Measure baseline" },
      },
    ],
  },
};

const planResponse = {
  implementation_id: "impl-1",
  analysis_id: "sess-1",
  decision_id: "abc-123",
  selected_path: "partner",
  partner_id: "demo-northstar",
  partner_name: "Northstar Automation",
  partner_status: "not_requested",
  stages: [1, 2, 3, 4, 5, 6].map((i) => ({ index: i, name: `Stage ${i}`, status: "not_started", indicative: i % 2 === 0 })),
};

const requestResponse = {
  request_id: "req-1",
  implementation_id: "impl-1",
  status: "submitted",
  notification: {
    partner: { status: "dev_fallback", config_required: "Set MAILGUN_API_KEY" },
    user: { status: "dev_fallback" },
  },
  permalink: "/decisions/sess-1",
};

const partnersResponse = {
  note: "Demonstration partner data. No formal relationships are implied.",
  partners: [
    {
      id: "demo-northstar",
      name: "Northstar Automation",
      relationship_status: "demonstration",
      interventions: ["Workflow_Automation"],
      evidence_basis: "Illustrative capability profile; no verified outcomes yet.",
    },
  ],
};

const inviteResponse = {
  implementation_id: "impl-1",
  partner_name: "Northstar Automation",
  partner_status: "not_requested",
  decision: { title: "Workflow Automation" },
  stages: planResponse.stages,
};

describe("walkthrough: decision permanent link + save", () => {
  const originalFetch = globalThis.fetch;
  let calls: string[] = [];

  beforeEach(() => {
    vi.stubEnv("COMPASS_API_URL", "http://engine.test");
    calls = [];
    (globalThis as any).fetch = async (input: any) => {
      const url = String(input);
      calls.push(url);
      if (url.includes("/save")) return { ok: true, status: 200, json: async () => ({ decision_id: "sess-1", permalink: "/decisions/sess-1" }) };
      return { ok: true, status: 200, json: async () => analysisResponse };
    };
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    (globalThis as any).fetch = originalFetch;
  });

  it("loads a persisted decision and lets the user reach the Decision Brief", async () => {
    const res = await getDecision(new NextRequest("http://localhost/api/decisions/sess-1"), { params: { decision_id: "sess-1" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.analysis.decision.recommendations[0].title).toBe("Workflow Automation");
    expect(calls[0]).toContain("/api/analyze/sess-1");
  });

  it("reports a missing decision as not found", async () => {
    (globalThis as any).fetch = async () => ({ ok: false, status: 404, json: async () => ({}) });
    const res = await getDecision(new NextRequest("http://localhost/api/decisions/missing"), { params: { decision_id: "missing" } });
    expect(res.status).toBe(404);
  });

  it("loads a recommendation-created decision via the fallback store", async () => {
    (globalThis as any).fetch = async (input: any) => {
      const url = String(input);
      if (url.includes("/api/analyze/")) {
        return { ok: false, status: 404, json: async () => ({ detail: "Analysis session not found" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          recommendation_id: "rec-abc",
          recommendations: [{ rank: 1, title: "Workflow Automation", confidence: { label: "high" } }],
          methodology: { engine_version: "3.1.0" },
          assessment_summary: { problem_statement: "Manual invoice processing" },
        }),
      };
    };

    const res = await getDecision(new NextRequest("http://localhost/api/decisions/rec-abc"), { params: { decision_id: "rec-abc" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.analysis.analysis_id).toBe("rec-abc");
    expect(data.analysis.status).toBe("decision_ready");
    expect(data.analysis.decision.recommendations[0].title).toBe("Workflow Automation");
    expect(data.analysis.decision.methodology.engine_version).toBe("3.1.0");
    expect(data.analysis.decision.assessment_summary.problem_statement).toBe("Manual invoice processing");
  });

  it("saves a decision with an email and returns a permanent resume link", async () => {
    const res = await saveDecision(
      new NextRequest("http://localhost/api/decisions/sess-1/save", { method: "POST", body: JSON.stringify({ email: "ceo@acme.com" }) }),
      { params: { decision_id: "sess-1" } }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.permalink).toBe("/decisions/sess-1");
  });
});

describe("walkthrough: implement + partner request + plan + invite", () => {
  const originalFetch = globalThis.fetch;
  let calls: { url: string; body: any }[] = [];

  beforeEach(() => {
    vi.stubEnv("COMPASS_API_URL", "http://engine.test");
    calls = [];
    (globalThis as any).fetch = async (input: any, init?: any) => {
      const url = String(input);
      let body: any = {};
      try {
        body = init?.body ? JSON.parse(String(init.body)) : {};
      } catch {}
      calls.push({ url, body });
      if (url.includes("/accept")) return { ok: true, status: 200, json: async () => ({ implementation_id: "impl-1", partner_status: "accepted" }) };
      if (url.includes("/invite")) return { ok: true, status: 200, json: async () => inviteResponse };
      if (url.includes("/request")) return { ok: true, status: 200, json: async () => requestResponse };
      if (url.includes("/implement")) return { ok: true, status: 200, json: async () => planResponse };
      if (url.includes("/partners")) return { ok: true, status: 200, json: async () => partnersResponse };
      if (url.includes("/implementations")) return { ok: true, status: 200, json: async () => planResponse };
      return { ok: true, status: 200, json: async () => analysisResponse };
    };
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    (globalThis as any).fetch = originalFetch;
  });

  it("creates an implementation plan with exactly six ordered stages", async () => {
    const res = await implementDecision(
      new NextRequest("http://localhost/api/decisions/sess-1/implement", { method: "POST", body: JSON.stringify({ path: "partner", partner_id: "demo-northstar" }) }),
      { params: { decision_id: "sess-1" } }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.stages.map((s: any) => s.index)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(data.partner_status).toBe("not_requested");
  });

  it("partner request creates a record and reports a notification attempt", async () => {
    const res = await requestPartner(
      new NextRequest("http://localhost/api/implementations/impl-1/request", {
        method: "POST",
        body: JSON.stringify({ partner_id: "demo-northstar", contact_name: "Jane", contact_email: "jane@acme.com", organization: "Acme", requested_timeline: "8 weeks", notes: "", consent: true }),
      }),
      { params: { implementation_id: "impl-1" } }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("submitted");
    expect(data.notification.partner.status).toBe("dev_fallback");
    const call = calls.find((c) => c.url.includes("/request"));
    expect(call?.body).toMatchObject({ partner_id: "demo-northstar", contact_email: "jane@acme.com", consent: true });
  });

  it("live six-stage plan loads at its permanent implementation link", async () => {
    const res = await getPlan(new NextRequest("http://localhost/api/implementations/impl-1"), { params: { implementation_id: "impl-1" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.stages.length).toBe(6);
  });

  it("lists partners only as demonstration data", async () => {
    const res = await getPartners();
    expect(res.status).toBe(200);
    const data = await res.json();
    for (const p of data.partners) expect(p.relationship_status).toBe("demonstration");
  });

  it("partner invite is token-scoped and passes the token through", async () => {
    const res = await getInvite(new NextRequest("http://localhost/api/implementations/impl-1/invite/tok-1"), {
      params: { implementation_id: "impl-1", token: "tok-1" },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.partner_name).toBe("Northstar Automation");
    expect(calls.some((c) => c.url.includes("/invite/tok-1"))).toBe(true);
  });

  it("rejects an invalid/expired invite token", async () => {
    (globalThis as any).fetch = async () => ({ ok: false, status: 410, json: async () => ({}) });
    const res = await getInvite(new NextRequest("http://localhost/api/implementations/impl-1/invite/bad"), {
      params: { implementation_id: "impl-1", token: "bad" },
    });
    expect(res.status).toBe(404);
  });

  it("accepts a partner invite", async () => {
    const res = await acceptInvite(
      new NextRequest("http://localhost/api/implementations/impl-1/invite/tok-1/accept", { method: "POST" }),
      { params: { implementation_id: "impl-1", token: "tok-1" } }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.partner_status).toBe("accepted");
  });
});

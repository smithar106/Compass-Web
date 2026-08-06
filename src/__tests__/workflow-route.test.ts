import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getWorkflow } from "@/app/api/decisions/[decision_id]/workflow/route";

const ID = "rec-workflow-1";

describe("decision workflow route", () => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];

  beforeEach(() => {
    calls.length = 0;
    vi.stubEnv("COMPASS_API_URL", "http://engine.test");
  });

  afterEach(() => {
    (globalThis as any).fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("reports selected + outcome when the engine has both records", async () => {
    (globalThis as any).fetch = async (input: any) => {
      const url = String(input);
      calls.push(url);
      if (url.includes("/selection")) {
        return { ok: true, status: 200, json: async () => ({ selection_id: "s1" }) };
      }
      if (url.includes("/outcomes")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            total: 1,
            outcomes: [{ recommendation_id: ID, measured_result: "Cost down 42%" }],
          }),
        };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    };

    const res = await getWorkflow(new NextRequest(`http://localhost/api/decisions/${ID}/workflow`), {
      params: { decision_id: ID },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ decision_id: ID, selected: true, outcome: true });
    expect(calls.some((u) => u.includes("/selection"))).toBe(true);
    expect(calls.some((u) => u.includes("/api/outcomes"))).toBe(true);
  });

  it("reports false when neither record exists", async () => {
    (globalThis as any).fetch = async () => ({
      ok: false,
      status: 404,
      json: async () => ({}),
    });
    const res = await getWorkflow(new NextRequest(`http://localhost/api/decisions/${ID}/workflow`), {
      params: { decision_id: ID },
    });
    const data = await res.json();
    expect(data).toEqual({ decision_id: ID, selected: false, outcome: false });
  });
});

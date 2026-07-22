import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockCheckRateLimit = vi.fn();
const mockRunAssessment = vi.fn();

vi.mock("@/lib/supabase-server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

vi.mock("@/lib/supabase-admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

vi.mock("@compass/pipeline", () => ({
  runAssessment: (...args: unknown[]) => mockRunAssessment(...args),
}));

async function callPost(body: unknown, headers: Record<string, string> = {}): Promise<Response> {
  const { POST } = await import("@/app/api/pipeline/run/route");
  const request = new NextRequest("http://localhost/api/pipeline/run", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return POST(request);
}

function mockSingleSelect(result: unknown) {
  const single = vi.fn().mockResolvedValue(result);
  const limit = vi.fn().mockReturnValue({ single });
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ maybeSingle, single, limit });
  const select = vi.fn().mockReturnValue({ eq });
  mockFrom.mockReturnValue({ select, insert: vi.fn().mockReturnValue({ select }), update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) });
  return { select, eq, single, maybeSingle, limit };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockReturnValue(true);
});

describe("Pipeline route ownership", () => {
  it("rejects unauthenticated request", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("No session") });

    const res = await callPost({ sessionId: "test-session" });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Authentication required");
  });

  it("rejects request without sessionId", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    const res = await callPost({});
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });

  it("rejects request with empty sessionId", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    const res = await callPost({ sessionId: "" });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });

  it("rejects access to another user's assessment", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    mockSingleSelect({
      data: { user_id: "user-2", status: "in_progress", metadata: {} },
      error: null,
    });

    const res = await callPost({ sessionId: "session-owned-by-user2" });
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  it("rejects non-existent session", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    mockSingleSelect({ data: null, error: new Error("Not found") });

    const res = await callPost({ sessionId: "nonexistent-session" });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Session not found");
  });

  it("allows access to own assessment", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    mockSingleSelect({
      data: { user_id: "user-1", status: "in_progress", metadata: {} },
      error: null,
    });

    mockRunAssessment.mockResolvedValue({ mapId: "map-1", rankings: [] });

    const res = await callPost({ sessionId: "my-session" });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.mapId).toBe("map-1");
  });

  it("returns existing result from metadata when already completed (idempotency)", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    const existingResult = { mapId: "existing-map", rankings: [] };
    mockSingleSelect({
      data: {
        user_id: "user-1",
        status: "completed",
        metadata: { pipeline_result: existingResult },
      },
      error: null,
    });

    const res = await callPost({ sessionId: "already-completed-session" });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.mapId).toBe("existing-map");
    expect(mockRunAssessment).not.toHaveBeenCalled();
  });

  it("rejects request when rate limited", async () => {
    mockCheckRateLimit.mockReturnValue(false);

    const res = await callPost({ sessionId: "test-session" });
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.error).toContain("Too many requests");
  });

  it("does not expose stack traces on internal errors", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    mockSingleSelect({
      data: { user_id: "user-1", status: "in_progress", metadata: {} },
      error: null,
    });

    mockRunAssessment.mockRejectedValue(new Error("Internal database connection failed"));

    const res = await callPost({ sessionId: "error-session" });
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Pipeline execution failed");
    expect(body.stack).toBeUndefined();
  });

  it("handles malformed JSON body gracefully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });

    const { POST } = await import("@/app/api/pipeline/run/route");
    const request = new NextRequest("http://localhost/api/pipeline/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json-at-all",
    });

    const res = await POST(request);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Pipeline execution failed");
  });
});

describe("Design partners route duplication", () => {
  it("returns success for duplicate pending email", async () => {
    mockCheckRateLimit.mockReturnValue(true);

    mockSingleSelect({
      data: { id: "existing-id", status: "pending" },
      error: null,
    });

    const { POST } = await import("@/app/api/design-partners/route");
    const request = new NextRequest("http://localhost/api/design-partners", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Jane Smith",
        email: "jane@example.com",
        companyName: "Acme Corp",
        companySize: "51-200",
        role: "VP Product",
        linkedinUrl: "",
        currentAiInitiatives: "Exploring AI for customer support automation.",
        biggestChallenge: "Sales team spends too much time on manual data entry.",
      }),
    });
    const res = await POST(request);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain("already received");
  });
});

describe("Feedback route validation", () => {
  it("rejects feedback without required fields", async () => {
    mockCheckRateLimit.mockReturnValue(true);
    mockSingleSelect({ data: null, error: null });

    const { POST } = await import("@/app/api/assessment/feedback/route");
    const request = new NextRequest("http://localhost/api/assessment/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feedback_type: "useful" }),
    });
    const res = await POST(request);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });

  it("rejects invalid feedback_type", async () => {
    mockCheckRateLimit.mockReturnValue(true);
    mockSingleSelect({ data: null, error: null });

    const { POST } = await import("@/app/api/assessment/feedback/route");
    const request = new NextRequest("http://localhost/api/assessment/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        assessment_id: "550e8400-e29b-41d4-a716-446655440000",
        map_id: "map-1",
        engine_version: "2.0.0",
        feedback_type: "invalid_type_here",
      }),
    });
    const res = await POST(request);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });
});

describe("Health endpoint", () => {
  it("returns a response with all check fields", async () => {
    const { GET } = await import("@/app/api/health/route");
    const request = new NextRequest("http://localhost/api/health");
    const res = await GET(request);
    const body = await res.json();

    expect([200, 503]).toContain(res.status);
    expect(body.status).toBeDefined();
    expect(body.checks).toBeDefined();
    expect(body.checks.application).toBeDefined();
    expect(body.checks.auth_config).toBeDefined();
    expect(body.checks.schema).toBeDefined();
    expect(body.checks.database).toBeDefined();
    expect(body.version).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });

  it("does not expose secrets in response", async () => {
    const { GET } = await import("@/app/api/health/route");
    const request = new NextRequest("http://localhost/api/health");
    const res = await GET(request);
    const body = await res.json();

    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain(process.env.SUPABASE_SERVICE_ROLE_KEY || "service_role_key_placeholder");
    expect(serialized).not.toContain(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon_key_placeholder");
  });
});

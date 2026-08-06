import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import { Workspace } from "@/components/workspace/Workspace";
import { DECISION_REGISTRY_KEY } from "@/lib/workspace";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const fetchMock = vi.fn();

function decisionPayload(
  id: string,
  overrides: Partial<{
    status: string;
    created_at: string;
    problem_statement: string;
    business_function: string;
    rec_title: string;
  }> = {}
) {
  const {
    status = "decision_ready",
    created_at = "2026-08-01T12:00:00Z",
    problem_statement = `Problem ${id}`,
    business_function = "finance",
    rec_title = "AI Implementation",
  } = overrides;
  return {
    decision_id: id,
    analysis: {
      analysis_id: id,
      status,
      created_at,
      decision: {
        recommendation_id: id,
        recommendations: [
          {
            title: rec_title,
            outcome_ranges: [{ metric_label: "Processing Cost", low: 40, high: 60, unit: "%" }],
            next_validation_step: { action: `Next action ${id}` },
          },
        ],
        assessment_summary: { problem_statement, business_function },
      },
    },
  };
}

const COVERAGE_OK = {
  headline: { implementations: 1200, organizations: 340, industries: 42, high_quality_percent: 68 },
};

function seedRegistry(entries: { id: string; createdAt: string }[]) {
  localStorage.setItem(DECISION_REGISTRY_KEY, JSON.stringify(entries));
}

function mockDecisions(ids: string[]) {
  fetchMock.mockImplementation((input: unknown) => {
    const url = String(input);
    if (url.includes("/api/coverage")) {
      return Promise.resolve({ ok: true, json: async () => COVERAGE_OK });
    }
          if (url.includes("/workflow")) {
        const wfId = url.split("/api/decisions/")[1]?.split("/")[0];
        return Promise.resolve({
          ok: true,
          json: async () => ({ decision_id: wfId, selected: false, outcome: false }),
        });
      }
      const id = url.split("/api/decisions/")[1]?.split("?")[0];
    return Promise.resolve({ ok: true, json: async () => decisionPayload(id) });
  });
}

describe("Workspace", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
    fetchMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders with decisions from the registry and real persisted payloads", async () => {
    seedRegistry([
      { id: "rec-a", createdAt: "2026-08-01T12:00:00Z" },
      { id: "rec-b", createdAt: "2026-08-02T12:00:00Z" },
    ]);
    mockDecisions(["rec-a", "rec-b"]);
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);

    expect((await screen.findAllByText("Problem rec-a")).length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByText("Problem rec-b")).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("AI Implementation").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Under Review").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Processing Cost: 40–60%").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Next action rec/).length).toBeGreaterThanOrEqual(2);

    // Portfolio status summary counts
    expect(screen.getByText("Portfolio status")).toBeTruthy();

    // Coverage renders from the live API
    expect(await screen.findByText("1,200")).toBeTruthy();
    expect(screen.getByText("340")).toBeTruthy();
  });

  it("renders a useful empty state with the Start Assessment CTA", async () => {
    vi.stubGlobal("fetch", fetchMock);
    render(<Workspace />);

    expect(await screen.findByText("No decisions yet")).toBeTruthy();
    expect(
      screen.getByText(/Start by describing one operational problem/i)
    ).toBeTruthy();
    const cta = screen.getByRole("link", { name: /start assessment/i });
    expect(cta.getAttribute("href")).toBe("/assessment");
  });

  it("filters by status", async () => {
    seedRegistry([
      { id: "rec-draft", createdAt: "2026-08-01T12:00:00Z" },
      { id: "rec-ready", createdAt: "2026-08-02T12:00:00Z" },
    ]);
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.includes("/api/coverage")) {
        return Promise.resolve({ ok: true, json: async () => COVERAGE_OK });
      }
            if (url.includes("/workflow")) {
        const wfId = url.split("/api/decisions/")[1]?.split("/")[0];
        return Promise.resolve({
          ok: true,
          json: async () => ({ decision_id: wfId, selected: false, outcome: false }),
        });
      }
      const id = url.split("/api/decisions/")[1]?.split("?")[0];
      const payload =
        id === "rec-draft"
          ? decisionPayload(id, { status: "awaiting_answers", problem_statement: "Draft problem" })
          : decisionPayload(id, { problem_statement: "Ready problem" });
      return Promise.resolve({ ok: true, json: async () => payload });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    expect((await screen.findAllByText("Draft problem")).length).toBeGreaterThanOrEqual(1);
    expect((await screen.findAllByText("Ready problem")).length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByRole("button", { name: "Under Review" }));

    const list = screen.getByRole("region", { name: "Decisions" });
    expect(within(list).getAllByText("Ready problem").length).toBeGreaterThanOrEqual(1);
    expect(within(list).queryAllByText("Draft problem")).toHaveLength(0);
  });

  it("searches decisions", async () => {
    seedRegistry([
      { id: "rec-a", createdAt: "2026-08-01T12:00:00Z" },
      { id: "rec-b", createdAt: "2026-08-02T12:00:00Z" },
    ]);
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.includes("/api/coverage")) {
        return Promise.resolve({ ok: true, json: async () => COVERAGE_OK });
      }
            if (url.includes("/workflow")) {
        const wfId = url.split("/api/decisions/")[1]?.split("/")[0];
        return Promise.resolve({
          ok: true,
          json: async () => ({ decision_id: wfId, selected: false, outcome: false }),
        });
      }
      const id = url.split("/api/decisions/")[1]?.split("?")[0];
      return Promise.resolve({
        ok: true,
        json: async () =>
          decisionPayload(id, { problem_statement: id === "rec-a" ? "Invoice matching" : "Fleet routing" }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    expect((await screen.findAllByText("Invoice matching")).length).toBeGreaterThanOrEqual(1);

    fireEvent.change(screen.getByRole("searchbox", { name: /search decisions/i }), {
      target: { value: "fleet" },
    });

    const list = screen.getByRole("region", { name: "Decisions" });
    expect(within(list).getAllByText("Fleet routing").length).toBeGreaterThanOrEqual(1);
    expect(within(list).queryAllByText("Invoice matching")).toHaveLength(0);
  });

  it("links each decision to its permanent decision page", async () => {
    seedRegistry([{ id: "rec-a", createdAt: "2026-08-01T12:00:00Z" }]);
    mockDecisions(["rec-a"]);
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    const links = await screen.findAllByRole("link", { name: "Problem rec-a" });
    expect(links[0].getAttribute("href")).toBe("/decisions/rec-a");
  });

  it("routes New Decision and quick actions correctly", async () => {
    seedRegistry([
      { id: "rec-a", createdAt: "2026-08-01T12:00:00Z" },
      { id: "rec-b", createdAt: "2026-08-02T12:00:00Z" },
    ]);
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.includes("/api/coverage")) {
        return Promise.resolve({ ok: true, json: async () => COVERAGE_OK });
      }
            if (url.includes("/workflow")) {
        const wfId = url.split("/api/decisions/")[1]?.split("/")[0];
        return Promise.resolve({
          ok: true,
          json: async () => ({ decision_id: wfId, selected: false, outcome: false }),
        });
      }
      const id = url.split("/api/decisions/")[1]?.split("?")[0];
      return Promise.resolve({
        ok: true,
        json: async () =>
          decisionPayload(id, {
            created_at: id === "rec-b" ? "2026-08-02T12:00:00Z" : "2026-08-01T12:00:00Z",
          }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    await screen.findAllByText("Problem rec-b");

    const newDecision = screen.getAllByRole("link", { name: /new decision/i });
    for (const link of newDecision) {
      expect(link.getAttribute("href")).toBe("/assessment");
    }

    // Latest decision is the most recently created (rec-b).
    const latest = screen.getByRole("link", { name: /open latest decision/i });
    expect(latest.getAttribute("href")).toBe("/decisions/rec-b");

    const demo = screen.getByRole("link", { name: /view demo/i });
    expect(demo.getAttribute("href")).toBe("/demo");
  });

  it("degrades gracefully when the coverage API fails", async () => {
    seedRegistry([{ id: "rec-a", createdAt: "2026-08-01T12:00:00Z" }]);
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.includes("/api/coverage")) {
        return Promise.resolve({ ok: false, status: 500, json: async () => ({}) });
      }
      return Promise.resolve({ ok: true, json: async () => decisionPayload("rec-a") });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);

    expect((await screen.findAllByText("Problem rec-a")).length).toBeGreaterThanOrEqual(1);
    expect(
      await screen.findByText(/Coverage is temporarily unavailable/i)
    ).toBeTruthy();
  });

  it("does not call any write endpoints while rendering", async () => {
    seedRegistry([{ id: "rec-a", createdAt: "2026-08-01T12:00:00Z" }]);
    mockDecisions(["rec-a"]);
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    await screen.findAllByText("Problem rec-a");

    const calls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(calls.every((u) => !/POST|PUT|PATCH|DELETE/.test(u))).toBe(true);
    // One decision fetch + one lifecycle check per decision, plus coverage.
    expect(calls.filter((u) => u.includes("/api/decisions/") && !u.includes("/workflow")).length).toBe(1);
    expect(calls.filter((u) => u.includes("/workflow")).length).toBe(1);
    expect(calls.filter((u) => u.includes("/api/coverage")).length).toBe(1);
  });
});

describe("Workspace lifecycle actions", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("approves a decision via the engine and moves it to Approved", async () => {
    seedRegistry([{ id: "rec-a", createdAt: "2026-08-01T12:00:00Z" }]);
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.includes("/api/coverage")) {
        return Promise.resolve({ ok: true, json: async () => COVERAGE_OK });
      }
      if (url.includes("/approve")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
      }
      if (url.includes("/workflow")) {
        return Promise.resolve({ ok: true, json: async () => ({ selected: false, outcome: false }) });
      }
      return Promise.resolve({ ok: true, json: async () => decisionPayload("rec-a") });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    await screen.findAllByText("Problem rec-a");

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    const list = screen.getByRole("region", { name: "Decisions" });
    expect(await within(list).findAllByText("Approved")).toBeTruthy();
    expect(fetchMock.mock.calls.some((c) => String(c[0]).includes("/approve"))).toBe(true);
  });

  it("records a measured outcome and moves the decision to Completed", async () => {
    seedRegistry([{ id: "rec-a", createdAt: "2026-08-01T12:00:00Z" }]);
    fetchMock.mockImplementation((input: unknown) => {
      const url = String(input);
      if (url.includes("/api/coverage")) {
        return Promise.resolve({ ok: true, json: async () => COVERAGE_OK });
      }
      if (url.includes("/outcome")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
      }
      if (url.includes("/workflow")) {
        // Pre-approved so the Report outcome action is available.
        return Promise.resolve({ ok: true, json: async () => ({ selected: true, outcome: false }) });
      }
      return Promise.resolve({ ok: true, json: async () => decisionPayload("rec-a") });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Workspace />);
    await screen.findAllByText("Problem rec-a");

    fireEvent.click(screen.getByRole("button", { name: /report outcome/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /measured result/i }), {
      target: { value: "Cost down 42% in 90 days" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    const list = screen.getByRole("region", { name: "Decisions" });
    expect(await within(list).findByText("✓ Measured")).toBeTruthy();
    const outcomeCall = fetchMock.mock.calls.find((c) => String(c[0]).includes("/outcome"));
    expect(outcomeCall).toBeTruthy();
    expect(String(outcomeCall![1]?.body)).toContain("Cost down 42% in 90 days");
  });
});

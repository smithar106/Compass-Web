import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import HomePage from "@/app/(site)/page";
import AssessmentPage from "@/app/assessment/page";
import DecisionPage from "@/app/(site)/decisions/[decision_id]/page";
import { Workspace } from "@/components/workspace/Workspace";
import DemoPage from "@/app/demo/page";
import DemoLayout from "@/app/demo/layout";
import { DECISION_REGISTRY_KEY } from "@/lib/workspace";

const { pushMock, pathnameMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  pathnameMock: vi.fn(() => "/"),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => pathnameMock(),
  useParams: () => ({ decision_id: "rec-journey" }),
}));

vi.mock("@/lib/supabase", () => ({
  ensureAuthenticated: vi.fn().mockResolvedValue({ id: "u1" }),
}));

vi.mock("@/lib/analytics", () => ({
  trackAssessmentStarted: vi.fn(),
  trackAssessmentCompleted: vi.fn(),
}));

const DECISION_ID = "rec-journey";

const DECISION_PAYLOAD = {
  decision_id: DECISION_ID,
  analysis: {
    analysis_id: DECISION_ID,
    status: "decision_ready",
    created_at: "2026-08-01T12:00:00Z",
    decision: {
      recommendation_id: DECISION_ID,
      methodology: { evidence_count: { unique_organizations: 18 } },
      assessment_summary: {
        problem_statement: "Our finance team manually reconciles invoices",
        business_function: "finance",
      },
      recommendations: [
        {
          rank: 1,
          title: "Automated Invoice Matching",
          category: "Workflow_Automation",
          confidence: { score: 0.82, label: "high" },
          evidence_summary: { overall_tier: "gold", total_comparables: 24 },
          outcome_ranges: [{ metric_label: "processing cost", low: 40, high: 60, median: 50, unit: "%" }],
          comparable_implementations: [],
          risks: [],
          assumptions_detail: [],
          information_gaps: [],
          alternatives_considered: [],
          next_validation_step: { action: "Measure baseline" },
          impact: { implementation_timeline: { min_weeks: 8, max_weeks: 12, expected_weeks: 10 } },
        },
      ],
    },
  },
};

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

const fetchMock = vi.fn();

function mockFetch() {
  fetchMock.mockImplementation((input: unknown) => {
    const url = String(input);
    if (url.includes("/api/coverage")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ headline: { implementations: 1200, organizations: 340, industries: 42, high_quality_percent: 68 } }),
      });
    }
    if (url.includes("/api/recommendations") ) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ recommendation_id: DECISION_ID, generated_at: "2026-08-01T12:00:00Z", recommendations: [] }),
      });
    }
    if (url.includes("/api/decisions/")) {
      return Promise.resolve({ ok: true, json: async () => DECISION_PAYLOAD });
    }
    return Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
  });
}

const ANSWERS = [
  "Finance",
  "Our finance team manually reconciles invoices",
  "26–50",
  "Cost reduction",
  "1–3 months",
];

describe("Customer journey (route-level integration)", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
    pathnameMock.mockReturnValue("/");
    fetchMock.mockReset();
    mockMatchMedia();
    mockFetch();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("traces homepage → assessment → decision → workspace → demo", async () => {
    // 1. Homepage CTA → assessment
    render(<HomePage />);
    const startCta = screen.getAllByRole("link", { name: /start assessment/i });
    expect(startCta.length).toBeGreaterThanOrEqual(1);
    expect(startCta[0].getAttribute("href")).toBe("/assessment");
    cleanup();

    // 2. Seeded assessment completion → generated decision
    render(<AssessmentPage />);
    await screen.findByTestId("assessment-question-label");
    for (let i = 0; i < ANSWERS.length; i++) {
      fireEvent.click(screen.getByRole("button", { name: ANSWERS[i] }));
      fireEvent.click(
        screen.getByRole("button", {
          name: i === ANSWERS.length - 1 ? /generate executive recommendation/i : /continue/i,
        })
      );
    }
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith(`/decisions/${DECISION_ID}`));
    // The created decision is recorded for the workspace.
    const registry = JSON.parse(localStorage.getItem(DECISION_REGISTRY_KEY) ?? "[]");
    expect(registry.some((e: { id: string }) => e.id === DECISION_ID)).toBe(true);
    cleanup();

    // 3. Executive Recommendation (decision page, shareable permanent link)
    render(<DecisionPage />);
    expect(await screen.findByTestId("decision-title")).toBeTruthy();
    expect(screen.getByText("Automated Invoice Matching")).toBeTruthy();
    // Return to workspace completes the loop.
    const workspaceLink = screen.getByRole("link", { name: /return to workspace/i });
    expect(workspaceLink.getAttribute("href")).toBe("/workspace");
    cleanup();

    // 4. Workspace shows the real decision and links back to it
    render(<Workspace />);
    const decisionLink = await screen.findAllByRole("link", { name: "Our finance team manually reconciles invoices" });
    expect(decisionLink.length).toBeGreaterThanOrEqual(1);
    expect(decisionLink[0].getAttribute("href")).toBe(`/decisions/${DECISION_ID}`);
    cleanup();

    // 5. Opening the demo from the workspace
    render(<Workspace />);
    await screen.findAllByText("Our finance team manually reconciles invoices");
    const demoLink = screen.getByRole("link", { name: /view demo/i });
    expect(demoLink.getAttribute("href")).toBe("/demo");
    cleanup();

    // The demo itself renders deterministically
    render(
      <DemoLayout>
        <DemoPage />
      </DemoLayout>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Executive overview");
    expect(screen.getByText("Northwind Manufacturing")).toBeTruthy();
    expect(screen.getByText(/Demo environment/i)).toBeTruthy();
  });
});

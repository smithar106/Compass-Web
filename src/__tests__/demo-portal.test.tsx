import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import DemoLayout from "@/app/demo/layout";
import DemoPage from "@/app/demo/page";
import DemoDecisionsPage from "@/app/demo/decisions/page";
import DemoDecisionDetailPage from "@/app/demo/decisions/[id]/page";
import DemoIntelligencePage from "@/app/demo/intelligence/page";
import DemoOutcomesPage from "@/app/demo/outcomes/page";
import {
  DEMO_ORG,
  demoDecisions,
  priorityDecisions,
  demoSummary,
  coverageSummary,
  demoActivity,
  measuredOutcomes,
} from "@/data/demo-data";

const { pathnameMock } = vi.hoisted(() => ({ pathnameMock: vi.fn(() => "/demo") }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
  useRouter: () => ({ push: vi.fn() }),
}));

const fetchMock = vi.fn();

function renderPortal(page: React.ReactElement) {
  return render(<DemoLayout>{page}</DemoLayout>);
}

function allLinks(): string[] {
  return Array.from(document.querySelectorAll("a"))
    .map((a) => a.getAttribute("href") ?? "")
    .filter((h) => h.startsWith("/"));
}

const DEMO_ROUTES = new Set([
  "/demo",
  "/demo/assessment",
  "/demo/decisions",
  "/demo/intelligence",
  "/demo/outcomes",
  "/assessment",
  ...demoDecisions.map((d) => `/demo/decisions/${d.id}`),
]);

describe("Demo portal", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the overview without authentication", () => {
    renderPortal(<DemoPage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Executive overview");
    expect(screen.getByText(DEMO_ORG.name)).toBeTruthy();
    expect(screen.getByText(/Reporting period:/i)).toBeTruthy();
    expect(screen.getByText(/Demo environment/i)).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("exposes deterministic seeded metrics", () => {
    expect(DEMO_ORG).toEqual({ name: "Northwind Manufacturing", period: "Q2 2026" });
    expect(demoDecisions).toHaveLength(15);
    expect(priorityDecisions.map((d) => d.id)).toEqual([
      "invoice-ai",
      "support-automation",
      "procurement-redesign",
      "fleet-optimization",
      "contract-review",
    ]);
    expect(demoSummary).toEqual({
      underReview: 3,
      approvedPilots: 2,
      activeImplementations: 4,
      completedMeasured: 6,
    });
    expect(coverageSummary).toEqual({ strong: 2, moderate: 3, thin: 3, insufficient: 2 });
    expect(demoActivity).toHaveLength(6);
    // Outcomes derive only from completed decisions with measured metrics.
    expect(measuredOutcomes.length).toBeGreaterThanOrEqual(6);
    const completed = demoDecisions.filter((d) => d.status === "completed");
    expect(completed.every((d) => d.outcome && d.outcome.length > 0)).toBe(true);
  });

  it("renders the required summary cards", () => {
    renderPortal(<DemoPage />);
    expect(screen.getByText("Decisions under review")).toBeTruthy();
    expect(screen.getByText("Approved pilots")).toBeTruthy();
    expect(screen.getByText("Active implementations")).toBeTruthy();
    expect(screen.getAllByText("Completed · measured").length).toBeGreaterThanOrEqual(1);
  });

  it("opens the correct demo decision from a priority card", () => {
    renderPortal(<DemoPage />);
    const invoiceLink = screen.getByRole("link", {
      name: /AI-powered invoice processing/i,
    });
    expect(invoiceLink.getAttribute("href")).toBe("/demo/decisions/invoice-ai");
  });

  it("renders a populated decision detail with back navigation", () => {
    render(<DemoDecisionDetailPage params={{ id: "invoice-ai" }} />);
    expect(
      screen.getByRole("heading", { level: 1 }).textContent
    ).toContain("AI-powered invoice processing");
    expect(screen.getByText(/Automated invoice matching with exception-based review/i)).toBeTruthy();
    expect(screen.getByText("VP, Finance Operations")).toBeTruthy();
    expect(screen.getByText(/Weeks 1–16/)).toBeTruthy();
    const back = screen.getByRole("link", { name: /all decisions/i });
    expect(back.getAttribute("href")).toBe("/demo/decisions");
  });

  it("shows measured outcomes for completed decisions", () => {
    render(<DemoDecisionDetailPage params={{ id: "contract-review" }} />);
    expect(screen.getByText("Measured outcomes")).toBeTruthy();
    expect(screen.getByText("44% faster")).toBeTruthy();
  });

  it("handles an unknown decision id gracefully", () => {
    render(<DemoDecisionDetailPage params={{ id: "not-a-real-id" }} />);
    expect(screen.getByText("Decision not found")).toBeTruthy();
    const back = screen.getByRole("link", { name: /back to decisions/i });
    expect(back.getAttribute("href")).toBe("/demo/decisions");
  });

  it("keeps the demo sandboxed and routes to the real assessment explicitly", () => {
    renderPortal(<DemoPage />);
    // New Decision stays inside the demo (sandboxed assessment).
    const buttons = screen.getAllByRole("link", { name: /new decision/i });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    for (const b of buttons) {
      expect(b.getAttribute("href")).toBe("/demo/assessment");
    }
    // The production path is labeled explicitly.
    const real = screen.getAllByRole("link", { name: /real assessment/i });
    expect(real.length).toBeGreaterThanOrEqual(1);
    for (const r of real) {
      expect(r.getAttribute("href")).toBe("/assessment");
    }
  });

  it("has coherent demo navigation with no dead links", () => {
    const tabs = ["Overview", "Decisions", "Implementation Intelligence", "Outcomes"];
    renderPortal(<DemoPage />);
    for (const tab of tabs) {
      expect(screen.getByRole("link", { name: tab })).toBeTruthy();
    }
    // Overview page links
    for (const href of allLinks()) {
      expect(DEMO_ROUTES.has(href), `dead link on overview: ${href}`).toBe(true);
    }
  });

  it("has no dead links on the decisions, intelligence, and outcomes pages", () => {
    cleanup();
    renderPortal(<DemoDecisionsPage />);
    for (const href of allLinks()) {
      expect(DEMO_ROUTES.has(href), `dead link on decisions: ${href}`).toBe(true);
    }

    cleanup();
    renderPortal(<DemoIntelligencePage />);
    for (const href of allLinks()) {
      expect(DEMO_ROUTES.has(href), `dead link on intelligence: ${href}`).toBe(true);
    }

    cleanup();
    renderPortal(<DemoOutcomesPage />);
    for (const href of allLinks()) {
      expect(DEMO_ROUTES.has(href), `dead link on outcomes: ${href}`).toBe(true);
    }
  });

  it("shows every decision in the decisions view", () => {
    renderPortal(<DemoDecisionsPage />);
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(demoDecisions.length);
    for (const d of demoDecisions) {
      expect(screen.getByRole("link", { name: new RegExp(d.title, "i") })).toBeTruthy();
    }
  });

  it("never calls production write endpoints during demo interaction", () => {
    renderPortal(<DemoPage />);
    fireEvent.click(screen.getByRole("link", { name: /AI-powered invoice processing/i }));
    fireEvent.click(screen.getByRole("link", { name: "Decisions" }));
    fireEvent.click(screen.getByRole("link", { name: "Outcomes" }));
    fireEvent.click(screen.getByRole("link", { name: /new decision/i }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

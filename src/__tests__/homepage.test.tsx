import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { site } from "@/content/site";
import HomePage from "@/app/page";
import DemoPage from "@/app/demo/page";

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

describe("Homepage content", () => {
  beforeEach(() => {
    mockMatchMedia();
  });

  it("should open with the scarce-judgment value proposition", () => {
    const h = site.marketing.home.hero;
    expect(h.eyebrow).toBe("Decision intelligence for operations");
    expect(h.headline).toBe("Implementation is becoming abundant. Judgment remains scarce.");
    expect(h.ctaPrimary).toBe("Start Assessment");
    expect(h.ctaPrimaryHref).toBe("/assessment");
    expect(h.ctaSecondary).toBe("View Demo");
    expect(h.ctaSecondaryHref).toBe("/demo");
    expect(h.supporting).toContain("before committing people, capital, and implementation effort");
  });

  it("should frame the problem as implementation beginning before comparison", () => {
    const p = site.marketing.home.problem;
    expect(p.headline).toContain("before the comparison");
    expect(p.options).toEqual([
      "AI implementation",
      "Workflow automation",
      "Process redesign",
      "Software",
      "Staffing",
      "Hybrid approaches",
      "No action",
    ]);
    expect(p.options).toHaveLength(7);
  });

  it("should show the full lifecycle from problem to better future decisions", () => {
    const h = site.marketing.home.howItWorks;
    expect(h.steps).toHaveLength(7);
    expect(h.steps.map((s) => s.name)).toEqual([
      "Business Problem",
      "Assessment",
      "Executive Recommendation",
      "Approval",
      "Implementation",
      "Measured Outcomes",
      "Better Future Decisions",
    ]);
  });

  it("should build trust on a growing library of real implementation evidence", () => {
    const i = site.marketing.home.intelligence;
    expect(i.headline).toContain("grounded in real implementations");
    expect(i.supporting).toContain("continuously growing library of real implementation evidence");
    expect(i.features).toHaveLength(4);
    // No internal engine terminology on the public homepage.
    expect(`${i.supporting} ${i.features.map((f) => f.detail).join(" ")}`).not.toMatch(
      /tier|crawler|similarity score|database/i
    );
  });

  it("should describe the executive recommendation contents", () => {
    const b = site.marketing.home.brief;
    expect(b.headline).toContain("one-page recommendation");
    expect(b.supporting).toContain("expected outcomes");
    expect(b.supporting).toContain("supporting evidence");
    expect(b.supporting).toContain("strategy and objectives");
    expect(b.supporting).toContain("implementation plan");
  });

  it("should explain compounding value from preserved decisions", () => {
    const c = site.marketing.home.compounding;
    expect(c.headline).toBe("Every operational decision makes the next one better.");
    expect(c.points).toHaveLength(3);
    expect(c.points.map((p) => p.title)).toEqual([
      "Decisions are preserved",
      "Outcomes are measured",
      "Lessons are kept",
    ]);
  });

  it("should close on a Start Assessment call to action", () => {
    const c = site.marketing.home.cta;
    expect(c.headline).toBe("Make the right decision before implementation begins.");
    expect(c.ctaPrimary).toBe("Start Assessment");
    expect(c.ctaPrimaryHref).toBe("/assessment");
    expect(c.ctaSecondary).toBe("View Demo");
    expect(c.ctaSecondaryHref).toBe("/demo");
  });

  it("should preserve the legacy marketing sections used by other pages", () => {
    // Other pages (product, how-it-works, evidence, about) still depend on these.
    expect(site.marketing.founder.name).toContain("Arthur");
    expect(site.marketing.finalCta.headline).toContain("Before you implement anything");
    expect(site.marketing.lifecycle.stages).toHaveLength(4);
    expect(site.marketing.examples.length).toBeGreaterThanOrEqual(6);
  });
});

describe("Homepage CTA routing", () => {
  beforeEach(() => {
    mockMatchMedia();
  });

  it("should render the homepage with a single H1 and all seven sections", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Implementation is becoming abundant. Judgment remains scarce."
    );
    // One h2 per section header (hero owns the single h1).
    const h2s = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent ?? "");
    expect(h2s).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Implementation begins before the comparison"),
        expect.stringContaining("From business problem to better future decisions"),
        expect.stringContaining("A one-page recommendation you can act on"),
        expect.stringContaining("grounded in real implementations"),
        expect.stringContaining("Every operational decision makes the next one better"),
        expect.stringContaining("Make the right decision before implementation begins"),
      ])
    );
  });

  it("should point every Start Assessment CTA at /assessment", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link", { name: /start assessment/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/assessment");
    }
  });

  it("should point every View Demo CTA at /demo", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link", { name: /view demo/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/demo");
    }
  });

  it("should not embed the live assessment or dashboard on the homepage", () => {
    render(<HomePage />);
    expect(screen.queryByRole("button", { name: /analyze problem/i })).toBeNull();
    expect(screen.queryByText(/gold evidence|silver evidence|bronze evidence/i)).toBeNull();
  });

  it("should render the demo page and link to the real assessment", () => {
    render(<DemoPage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "See a Compass decision, end to end."
    );
    const links = screen.getAllByRole("link", { name: /start assessment/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/assessment");
    }
  });
});

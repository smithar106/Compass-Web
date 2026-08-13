import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { site } from "@/content/site";
import HomePage from "@/app/(site)/page";
import DemoPage from "@/app/demo/page";
import DemoLayout from "@/app/demo/layout";

const { pathnameMock } = vi.hoisted(() => ({ pathnameMock: vi.fn(() => "/demo") }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
  useRouter: () => ({ push: vi.fn() }),
}));

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

  it("should open with the new value proposition", () => {
    const h = site.marketing.home.hero;
    expect(h.headline).toBe("Bring us the problem. We'll find the best way forward—and make sure it delivers.");
    expect(h.ctaPrimary).toBe("Run an Assessment");
    expect(h.ctaPrimaryHref).toBe("/assessment");
    expect(h.ctaSecondary).toBe("See How Compass Works");
    expect(h.ctaSecondaryHref).toBe("/how-it-works");
    expect(h.supporting).toContain("economics, operations, technology, people, and customers");
    expect(h.supporting2).toContain("50,000+ real-world implementations");
  });

  it("should establish urgency with verified, citable industry statistics", () => {
    const p = site.marketing.home.problem;
    expect(p.stats).toHaveLength(3);
    expect(p.stats.map((s) => s.value)).toEqual(["30%", "39%", "6%"]);
    expect(p.stats.map((s) => s.source)).toEqual(["Gartner", "McKinsey", "McKinsey"]);
    expect(p.stats[0].detail).toContain("Poor data quality");
    // Every figure carries a source and a link to the underlying report.
    for (const s of p.stats) {
      expect(s.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("should explain why Compass exists in one workflow", () => {
    const h = site.marketing.home.howItWorks;
    expect(h.headline).toBe("Decide. Approve. Implement. Measure. Learn.");
    expect(h.steps).toHaveLength(7);
    expect(h.steps.map((s) => s.name)).toEqual([
      "Business Problem",
      "Assessment",
      "Executive Recommendation",
      "Approve & Launch",
      "Implementation Command Center",
      "Measured Outcomes",
      "Better Future Decisions",
    ]);
  });

  it("should frame the evidence library as the moat without internal jargon", () => {
    const i = site.marketing.home.intelligence;
    expect(i.headline).toBe("Every implementation makes the next recommendation better.");
    expect(i.points).toHaveLength(3);
    // No internal engine terminology on the public homepage.
    expect(`${i.headline} ${i.supporting} ${i.points.join(" ")}`).not.toMatch(
      /tier|crawler|similarity score|database|embedding|engine/i
    );
  });

  it("should describe the executive recommendation preview", () => {
    const b = site.marketing.home.brief;
    expect(b.headline).toBe("A board-ready recommendation \u2014 with execution built in.");
    expect(b.callout).toBe("From recommendation to measured outcome in one system.");
    expect(b.supporting).toContain("business impact");
    expect(b.supporting).toContain("evidence");
    expect(b.supporting).toContain("implementation plan");
  });

  it("should close on the cost-of-wrong-decisions call to action", () => {
    const c = site.marketing.home.cta;
    expect(c.headline).toBe("Before spending millions implementing the wrong solution\u2026");
    expect(c.emphasis).toBe("Make the right decision first.");
    expect(c.ctaPrimary).toBe("Start Assessment");
    expect(c.ctaPrimaryHref).toBe("/assessment");
    expect(c.ctaSecondary).toBe("View Demo");
    expect(c.ctaSecondaryHref).toBe("/demo");
  });

  it("should preserve the legacy marketing sections used by other pages", () => {
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

  it("should render the homepage with a single H1 and five sections", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Bring us the problem");
  });

  it("should point the hero Run an Assessment CTA at /assessment", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link", { name: /run an assessment/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/assessment");
    }
  });

  it("should point the hero See How Compass Works CTA at /how-it-works", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link", { name: /see how compass works/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/how-it-works");
    }
  });

  it("should not embed the live assessment or dashboard on the homepage", () => {
    render(<HomePage />);
    expect(screen.queryByRole("button", { name: /analyze problem/i })).toBeNull();
    expect(screen.queryByText(/gold evidence|silver evidence|bronze evidence/i)).toBeNull();
  });

  it("should render the demo portal and link to the real assessment", () => {
    render(
      <DemoLayout>
        <DemoPage />
      </DemoLayout>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Executive overview");
    // The demo has a link back to home.
    const homeLink = screen.getByRole("link", { name: /← Home/i });
    expect(homeLink.getAttribute("href")).toBe("/");
  });
});

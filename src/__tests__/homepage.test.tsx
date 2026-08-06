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

  it("should open with the scarce-judgment value proposition", () => {
    const h = site.marketing.home.hero;
    expect(h.headline).toBe("Implementation is becoming abundant. Judgment remains scarce.");
    expect(h.ctaPrimary).toBe("Start Assessment");
    expect(h.ctaPrimaryHref).toBe("/assessment");
    expect(h.ctaSecondary).toBe("View Demo");
    expect(h.ctaSecondaryHref).toBe("/demo");
    expect(h.supporting).toContain("Organizations spend millions implementing");
    expect(h.supporting2).toContain("make the right decision before implementation begins");
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
    expect(p.closing).toContain("deciding what should be built");
  });

  it("should explain why Compass exists in one workflow", () => {
    const h = site.marketing.home.howItWorks;
    expect(h.headline).toBe("Every operational decision makes the next one better.");
    expect(h.steps).toHaveLength(6);
    expect(h.steps.map((s) => s.name)).toEqual([
      "Business Problem",
      "Assessment",
      "Executive Recommendation",
      "Implementation",
      "Measured Outcomes",
      "Better Future Decisions",
    ]);
    expect(h.supporting).toContain("AI, workflow automation, software implementation, process redesign, staffing, and hybrid approaches");
  });

  it("should frame the evidence library as the moat without internal jargon", () => {
    const i = site.marketing.home.intelligence;
    expect(i.headline).toBe("The world\u2019s growing implementation intelligence library.");
    expect(i.supporting).toContain("real enterprise implementations");
    expect(i.points).toHaveLength(3);
    // No internal engine terminology on the public homepage.
    expect(`${i.headline} ${i.supporting} ${i.points.join(" ")}`).not.toMatch(
      /tier|crawler|similarity score|database|embedding|engine/i
    );
  });

  it("should describe the executive recommendation preview", () => {
    const b = site.marketing.home.brief;
    expect(b.headline).toBe("A board-ready recommendation.");
    expect(b.callout).toBe("Executive-ready in under 60 seconds.");
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

  it("should render the homepage with a single H1 and five sections", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Implementation is becoming abundant. Judgment remains scarce."
    );
    // One h2 per section header (hero owns the single h1).
    const h2s = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent ?? "");
    expect(h2s).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Implementation begins before the decision"),
        expect.stringContaining("Every operational decision makes the next one better"),
        expect.stringContaining("A board-ready recommendation"),
        expect.stringContaining("The world\u2019s growing implementation intelligence library"),
        expect.stringContaining("Before spending millions implementing the wrong solution"),
      ])
    );
  });

  it("should point every Start Assessment CTA at /assessment (hero and final CTA only)", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link", { name: /start assessment/i });
    // No repeated CTAs: exactly the hero CTA and the final CTA.
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/assessment");
    }
  });

  it("should point every View Demo CTA at /demo (hero and final CTA only)", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link", { name: /view demo/i });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/demo");
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
    // The demo's New Decision stays sandboxed; the real assessment is explicit.
    const links = screen.getAllByRole("link", { name: /new decision/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("/demo/assessment");
    }
    const real = screen.getAllByRole("link", { name: /real assessment/i });
    expect(real.length).toBeGreaterThanOrEqual(1);
    for (const r of real) {
      expect(r.getAttribute("href")).toBe("/assessment");
    }
  });
});

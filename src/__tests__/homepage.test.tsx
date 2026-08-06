import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should open with a clear enterprise decision platform value proposition", () => {
    const h = site.marketing.home.hero;
    expect(h.eyebrow).toBe("Enterprise decision platform");
    expect(h.headline).toContain("enterprise");
    expect(h.headline).toContain("decision platform");
    expect(h.headlineAccent).toBe("decision platform");
    expect(h.ctaPrimary).toBe("Start Assessment");
    expect(h.ctaPrimaryHref).toBe("/assessment");
    expect(h.ctaSecondary).toBe("Watch Demo");
    expect(h.supporting).toContain("spend millions implementing");
  });

  it("should frame the problem as scarce judgment, not scarce implementation", () => {
    const p = site.marketing.home.problem;
    expect(p.headline).toContain("Implementation is abundant");
    expect(p.headline).toContain("Judgment is scarce");
    expect(p.cards).toHaveLength(3);
    expect(p.cards.map((c) => c.stat)).toEqual(["Millions", "Most", "Few"]);
    expect(p.thesis).toContain("judgment as abundant as implementation");
  });

  it("should explain the full loop from problem to learning", () => {
    const h = site.marketing.home.howItWorks;
    expect(h.steps).toHaveLength(6);
    expect(h.steps.map((s) => s.name)).toEqual([
      "Business Problem",
      "Assessment",
      "Executive Recommendation",
      "Implementation",
      "Measured Outcomes",
      "Future Recommendations Improve",
    ]);
    expect(h.steps[2].detail).toContain("recommended strategy");
  });

  it("should build trust on the Implementation Intelligence Library", () => {
    const i = site.marketing.home.intelligence;
    expect(i.headline).toContain("grounded in real implementations");
    expect(i.features).toHaveLength(4);
    expect(i.features.map((f) => f.name)).toEqual([
      "Thousands of implementations",
      "Continuous learning",
      "Evidence-backed",
      "Executive-ready",
    ]);
  });

  it("should showcase the executive decision brief as the product artifact", () => {
    expect(site.marketing.home.brief.headline).toContain("take to the board");
    expect(site.marketing.home.screenshots.headline).toContain("Built for decisions");
  });

  it("should close on a Start Assessment call to action", () => {
    const c = site.marketing.home.cta;
    expect(c.headline).toContain("Before you implement anything");
    expect(c.ctaPrimary).toBe("Start Assessment");
    expect(c.ctaPrimaryHref).toBe("/assessment");
    expect(c.ctaSecondary).toBe("Watch Demo");
  });

  it("should preserve the legacy marketing sections used by other pages", () => {
    // Other pages (product, how-it-works, evidence, about) still depend on these.
    expect(site.marketing.founder.name).toContain("Arthur");
    expect(site.marketing.finalCta.headline).toContain("Before you implement anything");
    expect(site.marketing.lifecycle.stages).toHaveLength(4);
    expect(site.marketing.examples.length).toBeGreaterThanOrEqual(6);
  });
});

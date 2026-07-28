import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have accurate headline", () => {
    expect(site.hero.headline).toContain("Find the right solution");
  });

  it("should have an eyebrow", () => {
    expect(site.hero.eyebrow).toBe("Operational Decision Intelligence");
  });

  it("should have problem section with pain points", () => {
    expect(site.problem.painPoints).toHaveLength(4);
    expect(site.problem.painPoints[0].title).toBe("Wrong intervention selected");
  });

  it("should have solution section with 4 steps", () => {
    expect(site.solution.steps).toHaveLength(4);
    expect(site.solution.steps[0].step).toBe("Define");
  });

  it("should have outcomes section with 6 items", () => {
    expect(site.outcomes.items).toHaveLength(6);
    expect(site.outcomes.items[0].title).toContain("Reduce implementation risk");
  });

  it("should have differentiation with 3 columns", () => {
    expect(site.differentiation.columns).toHaveLength(3);
    expect(site.differentiation.columns[2].name).toBe("Compass");
    expect(site.differentiation.columns[2].highlighted).toBe(true);
  });

  it("should have sales example with impact and confidence note", () => {
    expect(site.exampleSales.impact).toBe("+$2.1M");
    expect(site.exampleSales.recommendation).toContain("AI-assisted lead qualification");
    expect(site.exampleSales.confidenceNote).toContain("comparable implementations");
  });

  it("should have finance example with impact and confidence note", () => {
    expect(site.exampleFinance.impact).toBe("+$420K");
    expect(site.exampleFinance.recommendation).toContain("Automated invoice");
    expect(site.exampleFinance.confidenceNote).toContain("comparable implementations");
  });

  it("should have healthcare example with impact and confidence note", () => {
    expect(site.exampleHealthcare.impact).toBe("+$3.8M");
    expect(site.exampleHealthcare.recommendation).toContain("AI-assisted claims");
    expect(site.exampleHealthcare.confidenceNote).toContain("comparable implementations");
  });

  it("should have about page content", () => {
    expect(site.about.headline).toContain("operational decision intelligence");
    expect(site.about.vision).toContain("evidence layer");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Start an Investigation");
  });
});

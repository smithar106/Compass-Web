import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have accurate headline about determining the best solution", () => {
    expect(site.hero.headline).toContain("determine the best solution");
  });

  it("should have 4 outcomes with Best Path label", () => {
    expect(site.hero.outcomes).toHaveLength(4);
    expect(site.hero.outcomes[0].label).toBe("Best Path");
  });

  it("should have hero recommendation panel", () => {
    expect(site.hero.recommendation.problem).toContain("misses 100 inbound calls");
    expect(site.hero.recommendation.impact).toBe("+$2.1M");
    expect(site.hero.recommendation.confidence).toBe("89%");
  });

  it("should have sales example with impact and confidence note", () => {
    expect(site.exampleSales.impact).toBe("+$2.1M");
    expect(site.exampleSales.recommendation).toContain("Hybrid AI-assisted");
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

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Start investigation");
  });
});
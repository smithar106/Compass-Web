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

  it("should have sales example with impact and confidence note", () => {
    expect(site.example.impact).toBe("+$2.1M");
    expect(site.example.recommendation).toContain("Hybrid AI-assisted");
    expect(site.example.confidenceNote).toContain("comparable implementations");
  });

  it("should have finance example with impact and confidence note", () => {
    expect(site.exampleFinance.impact).toBe("+$420K");
    expect(site.exampleFinance.recommendation).toContain("Automated invoice");
    expect(site.exampleFinance.confidenceNote).toContain("comparable implementations");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Start investigation");
  });
});
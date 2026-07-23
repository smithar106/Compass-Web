import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have multi-line headline about pressure", () => {
    expect(site.hero.headline).toContain("Every company is under pressure");
    expect(site.hero.headline).toContain("knowing where AI actually creates value");
  });

  it("should have primary and secondary CTAs", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See an example");
  });

  it("should have 4 pain cards in the hero", () => {
    expect(site.hero.painCards).toHaveLength(4);
    site.hero.painCards.forEach((c) => {
      expect(c.label).toBeTruthy();
      expect(c.pain).toBeTruthy();
      expect(c.compassSolves).toBeTruthy();
    });
  });

  it("should have example with steps and confidence", () => {
    expect(site.example.steps.length).toBe(5);
    expect(site.example.confidence).toBe("87%");
  });

  it("should have 4 evidence cards", () => {
    expect(site.evidence.cards).toHaveLength(4);
    expect(site.evidence.cards[0].source).toBe("Gartner");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.headline).toBe("Build the right solution first.");
    expect(site.finalCta.cta).toBe("Assess your operations");
  });
});
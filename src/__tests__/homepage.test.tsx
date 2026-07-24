import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have outcome-focused headline", () => {
    expect(site.hero.headline).toBe("Compass helps you solve the right problem, the right way.");
  });

  it("should have 3 bullets", () => {
    expect(site.hero.bullets.length).toBe(3);
    expect(site.hero.bullets[0]).toContain("Compare AI");
  });

  it("should have 4 outcome metrics", () => {
    expect(site.hero.outcomes).toHaveLength(4);
    expect(site.hero.outcomes[0].value).toBe("+$2.4M");
    expect(site.hero.outcomes[3].value).toBe("28\u00D7");
  });

  it("should have example with recommendation", () => {
    expect(site.example.recommendation).toContain("Hybrid AI-assisted");
    expect(site.example.impact).toBe("+$2.1M");
  });

  it("should have evidence section without cards", () => {
    expect(site.evidence.headline).toBeTruthy();
    expect((site.evidence as any).cards).toBeUndefined();
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Start investigation");
  });
});
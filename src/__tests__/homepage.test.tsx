import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have headline about wrong investment being expensive", () => {
    expect(site.hero.headline).toContain("Making the wrong AI investment is expensive");
  });

  it("should have bullet benefits", () => {
    expect(site.hero.bullets.length).toBe(4);
    expect(site.hero.bullets[0]).toContain("Define the business problem");
  });

  it("should have 3 decision mistakes", () => {
    expect(site.hero.decisionMistakes).toHaveLength(3);
  });

  it("should have trusted by sources", () => {
    expect(site.trustedBy.sources).toContain("Ramp");
    expect(site.trustedBy.sources).toContain("Gartner");
  });

  it("should have example unchanged", () => {
    expect(site.example.steps.length).toBe(5);
    expect(site.example.confidence).toBe("87%");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });
});
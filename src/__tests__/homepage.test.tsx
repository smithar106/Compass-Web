import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have primary hook as headline", () => {
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary CTA defined", () => {
    expect(site.hero.cta).toBeDefined();
    expect(site.hero.cta).toBe("Assess your operations");
  });

  it("should have secondary CTA", () => {
    expect(site.hero.ctaSecondary).toBeDefined();
    expect(site.hero.ctaSecondary).toBe("See an example map");
  });

  it("should list intervention options", () => {
    expect(site.hero.options).toContain("AI");
    expect(site.hero.options).toContain("Software");
    expect(site.hero.options).toContain("Process redesign");
    expect(site.hero.options).toContain("Human work");
    expect(site.hero.options).toContain("No automation yet");
  });

  it("should have problem section defined", () => {
    expect(site.problem.headline).toBeDefined();
    expect(site.problem.body).toBeDefined();
    expect(site.problem.items.length).toBeGreaterThanOrEqual(3);
  });

  it("should have insight section", () => {
    expect(site.insight.headline).toBeDefined();
    expect(site.insight.body).toBeDefined();
  });

  it("should have product loop with 5 steps", () => {
    expect(site.productLoop.steps).toHaveLength(5);
    expect(site.productLoop.steps[0]).toBe("Assessment");
    expect(site.productLoop.steps[4]).toBe("Implementation Blueprint");
  });

  it("should have existing tools section", () => {
    expect(site.existingTools.headline).toBeDefined();
    expect(site.existingTools.body).toBeDefined();
  });

  it("should have trust features", () => {
    expect(site.trust.features.length).toBeGreaterThanOrEqual(5);
    const labels = site.trust.features.map((f) => f.label);
    expect(labels).toContain("Assumptions");
    expect(labels).toContain("Expected impact");
  });

  it("should have future vision section", () => {
    expect(site.futureVision.headline).toBeDefined();
    expect(site.futureVision.items.length).toBeGreaterThanOrEqual(2);
  });

  it("should have four directions", () => {
    expect(site.fourDirections.directions).toHaveLength(4);
    const names = site.fourDirections.directions.map((d) => d.name);
    expect(names).toContain("North");
    expect(names).toContain("East");
    expect(names).toContain("South");
    expect(names).toContain("West");
  });

  it("should have final CTA section", () => {
    expect(site.finalCta.headline).toBeDefined();
    expect(site.finalCta.cta).toBeDefined();
  });
});
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
    expect(site.hero.options).toContain("Process Redesign");
    expect(site.hero.options).toContain("Human Work");
    expect(site.hero.options).toContain("No automation yet");
  });

  it("should have tighter hero subheading", () => {
    expect(site.hero.subtitle.length).toBeLessThan(140);
    expect(site.hero.subtitle).toContain("analyzes operational problems");
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

  it("should have product loop with 5 steps and subtitle", () => {
    expect(site.productLoop.steps).toHaveLength(5);
    expect(site.productLoop.steps[0]).toBe("Assessment");
    expect(site.productLoop.steps[4]).toBe("Implementation Blueprint");
    expect(site.productLoop.subtitle).toBeDefined();
    expect(site.productLoop.subtitle).toContain("evidence, assumptions, and measurable outcomes");
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

  it("should have example map section", () => {
    expect(site.exampleMap.headline).toBeDefined();
    expect(site.exampleMap.problem).toContain("100 calls");
    expect(site.exampleMap.steps.length).toBeGreaterThanOrEqual(5);
  });

  it("should have design partners with urgency", () => {
    expect(site.designPartners.subtitle).toContain("10 design partners");
    expect(site.designPartners.subtitle).toContain("August");
  });

  it("should have final CTA section", () => {
    expect(site.finalCta.headline).toBeDefined();
    expect(site.finalCta.cta).toBeDefined();
  });

  it("future vision should be on about page, not homepage", () => {
    expect((site as any).futureVision).toBeUndefined();
    expect(site.about.futureVision).toBeDefined();
    expect(site.about.futureVision.items.length).toBeGreaterThanOrEqual(2);
  });

  it("four directions should be on about page, not homepage", () => {
    expect((site as any).fourDirections).toBeUndefined();
    expect(site.about.compass).toBeDefined();
    expect(site.about.compass.directions).toHaveLength(4);
  });

  it("navigation should be simplified", () => {
    expect(site.nav).toHaveLength(4);
    const labels = site.nav.map((n) => n.label);
    expect(labels).toContain("Product");
    expect(labels).toContain("Example");
    expect(labels).not.toContain("Discovery");
  });
});
import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have primary hook as headline", () => {
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary CTA and secondary scroll-to-example", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See an example");
  });

  it("should list intervention options", () => {
    expect(site.hero.options).toContain("AI");
    expect(site.hero.options).toContain("Software");
    expect(site.hero.options).toContain("Process Redesign");
    expect(site.hero.options).toContain("Human Work");
    expect(site.hero.options).toContain("No automation yet");
  });

  it("should have problem section with wrong/better contrast", () => {
    expect(site.problem.headline).toBe("Most companies ask the wrong question.");
    expect(site.problem.wrong).toContain("How can we use AI");
    expect(site.problem.better).toContain("What is the best way");
  });

  it("should have example recommendation with realistic data", () => {
    expect(site.exampleRecommendation.headline).toBe("See Compass in action.");
    expect(site.exampleRecommendation.problem).toContain("100 calls");
    expect(site.exampleRecommendation.steps.length).toBeGreaterThanOrEqual(5);
    expect(site.exampleRecommendation.steps.some((s) => s.value === "87%")).toBe(true);
  });

  it("should have how-it-works with 5 steps", () => {
    expect(site.howItWorks.steps).toHaveLength(5);
    expect(site.howItWorks.headline).toContain("operational problem");
    const titles = site.howItWorks.steps.map((s) => s.title);
    expect(titles).toEqual(["Assess", "Discover", "Compare", "Recommend", "Blueprint"]);
  });

  it("should have trust section with 8 explainability features", () => {
    expect(site.trust.features.length).toBeGreaterThanOrEqual(6);
    const labels = site.trust.features.map((f) => f.label);
    expect(labels).toContain("Evidence");
    expect(labels).toContain("Confidence");
    expect(labels).toContain("Alternatives considered");
    expect(labels).toContain("Risks");
    expect(labels).toContain("Conditions that could change this recommendation");
  });

  it("should have differentiation section with execution vs compass", () => {
    expect(site.differentiation.headline).toBe("Your tools execute. Compass decides.");
    expect(site.differentiation.executionTools.length).toBeGreaterThanOrEqual(3);
    expect(site.differentiation.compassRole.length).toBeGreaterThanOrEqual(4);
  });

  it("should have design partners with both CTAs", () => {
    expect(site.designPartners.cta).toBe("Become a design partner");
    expect(site.designPartners.ctaSecondary).toBe("Assess your operations");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });

  it("should have simplified nav with 4 items", () => {
    expect(site.nav).toHaveLength(4);
  });

  it("should not reference '10 design partners' or specific months in design partners", () => {
    expect(site.designPartners.subtitle).not.toMatch(/\d+ design partners/);
    expect(site.designPartners.subtitle).not.toMatch(/August|September/);
  });
});
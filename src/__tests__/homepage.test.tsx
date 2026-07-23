import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have primary hook as headline", () => {
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary CTA", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See an example map");
  });

  it("should list intervention options", () => {
    expect(site.hero.options).toContain("AI");
    expect(site.hero.options).toContain("Software");
    expect(site.hero.options).toContain("Process Redesign");
    expect(site.hero.options).toContain("Human Work");
    expect(site.hero.options).toContain("No automation yet");
  });

  it("should have problem section with wrong-question framing", () => {
    expect(site.problem.headline).toBe("Most companies ask the wrong question.");
    expect(site.problem.subtitle).toContain("How can we use AI");
    expect(site.problem.subtitle).toContain("What is the best way");
  });

  it("should have example recommendation with problem and steps", () => {
    expect(site.exampleRecommendation.headline).toBe("See Compass in action.");
    expect(site.exampleRecommendation.problem).toContain("100 calls");
    expect(site.exampleRecommendation.steps.length).toBeGreaterThanOrEqual(5);
  });

  it("should have how-it-works with 5 steps", () => {
    expect(site.howItWorks.steps).toHaveLength(5);
    const titles = site.howItWorks.steps.map((s) => s.title);
    expect(titles).toContain("Assess");
    expect(titles).toContain("Discover");
    expect(titles).toContain("Compare");
    expect(titles).toContain("Recommend");
    expect(titles).toContain("Blueprint");
  });

  it("should have trust section with explainable features", () => {
    expect(site.trust.features.length).toBeGreaterThanOrEqual(4);
    const labels = site.trust.features.map((f) => f.label);
    expect(labels).toContain("Evidence");
    expect(labels).toContain("Confidence score");
    expect(labels).toContain("Alternatives considered");
  });

  it("should have 'Your tools execute' section", () => {
    expect(site.yourTools.headline).toBe("Your tools execute. Compass decides.");
    expect(site.yourTools.body).toBeDefined();
  });

  it("should have design partners with urgency", () => {
    expect(site.designPartners.subtitle).toContain("10 design partners");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });

  it("should have simplified nav with 4 items", () => {
    expect(site.nav).toHaveLength(4);
  });
});
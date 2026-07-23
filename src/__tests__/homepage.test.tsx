import { describe, it, expect } from "vitest";
import { site } from "@/content/site";
import { researchPapers } from "@/data/research";

describe("Homepage content", () => {
  it("should have primary hook as headline", () => {
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary CTA and secondary example scroll", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See Compass in action");
  });

  it("should list intervention options", () => {
    expect(site.hero.options).toContain("AI");
    expect(site.hero.options).toContain("Software");
    expect(site.hero.options).toContain("Process Redesign");
    expect(site.hero.options).toContain("Human Work");
    expect(site.hero.options).toContain("No automation yet");
  });

  it("should have pain section with 6 cards and thesis", () => {
    expect(site.pain.cards).toHaveLength(6);
    expect(site.pain.thesis).toContain("Implementation is becoming abundant");
    expect(site.pain.cards[0].compassSolves).toBeTruthy();
  });

  it("should have example recommendation with realistic data", () => {
    expect(site.exampleRecommendation.headline).toBe("See Compass in action.");
    expect(site.exampleRecommendation.problem).toContain("100");
    expect(site.exampleRecommendation.steps.some((s) => s.value === "87%")).toBe(true);
    expect(site.exampleRecommendation.steps.some((s) => s.value?.includes("routing"))).toBe(true);
  });

  it("should have how-it-works with 5 steps", () => {
    expect(site.howItWorks.steps).toHaveLength(5);
    expect(site.howItWorks.headline).toContain("operational problem");
    const titles = site.howItWorks.steps.map((s) => s.title);
    expect(titles).toEqual(["Assess", "Investigate", "Compare", "Recommend", "Blueprint"]);
  });

  it("should have research evidence section with papers", () => {
    expect(researchPapers.length).toBeGreaterThanOrEqual(3);
    expect(researchPapers[0].compassInterpretation).toBeTruthy();
    expect(researchPapers[0].source).toBeTruthy();
  });

  it("should have design partners with both CTAs", () => {
    expect(site.designPartners.cta).toBe("Become a design partner");
    expect(site.designPartners.ctaSecondary).toBe("Assess your operations");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });

  it("should have nav with 5 items", () => {
    expect(site.nav).toHaveLength(5);
  });
});
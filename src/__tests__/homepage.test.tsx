import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have primary hook as headline", () => {
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary CTA and secondary example scroll", () => {
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

  it("should have pain recognition section with 5 cards", () => {
    expect(site.pain.cards).toHaveLength(5);
    expect(site.pain.bridge).toContain("Compass was built for you");
    expect(site.pain.cards[0].pain).toContain("Which problem");
  });

  it("should have example recommendation with realistic data", () => {
    expect(site.exampleRecommendation.headline).toBe("See Compass in action.");
    expect(site.exampleRecommendation.problem).toContain("100 calls");
    expect(site.exampleRecommendation.steps.some((s) => s.value === "87%")).toBe(true);
    expect(site.exampleRecommendation.steps.some((s) => s.value?.includes("call routing"))).toBe(true);
  });

  it("should have how-it-works with 5 steps", () => {
    expect(site.howItWorks.steps).toHaveLength(5);
    expect(site.howItWorks.headline).toContain("operational problem");
    const titles = site.howItWorks.steps.map((s) => s.title);
    expect(titles).toEqual(["Assess", "Discover", "Compare", "Recommend", "Blueprint"]);
  });

  it("should have research evidence section with papers", () => {
    expect(site.evidence.papers.length).toBeGreaterThanOrEqual(3);
    expect(site.evidence.papers[0].compassInterpretation).toBeTruthy();
    expect(site.evidence.papers[0].misinterpretation).toBeTruthy();
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
});
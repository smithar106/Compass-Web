import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should open with a decision input rather than a marketing hero", () => {
    expect(site.marketing.hero.claim).toContain("Describe your operational challenge");
    expect(site.marketing.hero.inputPlaceholder).toContain("Describe the problem");
    expect(site.marketing.hero.analyzeCta).toBe("Analyze");
    expect(site.marketing.hero.examples.length).toBeGreaterThanOrEqual(4);
  });

  it("should position Compass as confidence infrastructure", () => {
    expect(site.tagline).toContain("Confidence infrastructure");
    expect(site.marketing.hero.eyebrow).toContain("Confidence infrastructure");
    expect(site.metadata.title).toContain("Confidence Infrastructure");
  });

  it("should define the four confidence pillars in order", () => {
    const pillars = site.marketing.pillars.items;
    expect(pillars).toHaveLength(4);
    expect(pillars.map((p) => p.name)).toEqual(["Evidence", "Implementation", "Learning", "Improvement"]);
    expect(pillars[0].tag).toContain("fits the problem");
    expect(pillars[2].tag).toContain("measured honestly");
    expect(pillars[3].tag).toContain("better decisions");
  });

  it("should expose live recommendation rankings", () => {
    expect(site.marketing.liveRecommendation.rankings.map((r) => r.label)).toEqual([
      "Highest confidence",
      "Highest ROI",
      "Fastest to implement",
      "Highest evidence",
      "Most common",
    ]);
  });

  it("should provide a searchable catalog of recommendation cards", () => {
    expect(site.marketing.catalog.searchPlaceholder).toContain("Search operational problems");
    expect(site.marketing.examples.length).toBeGreaterThanOrEqual(6);
    const card = site.marketing.examples[0];
    expect(card.problem.length).toBeGreaterThan(0);
    expect(card.intervention.length).toBeGreaterThan(0);
    expect(card.confidence.score).toBeGreaterThan(0);
    expect(card.evidence.comparables).toBeGreaterThan(0);
    expect(card.alternatives.length).toBeGreaterThanOrEqual(1);
  });

  it("should keep the four-stage lifecycle for the product page", () => {
    const stages = site.marketing.lifecycle.stages;
    expect(stages).toHaveLength(4);
    expect(stages.map((s) => s.name)).toEqual(["Decide", "Implement", "Monitor", "Improve"]);
    expect(stages[0].status).toBe("Available now");
  });

  it("should have a founder section and final CTA", () => {
    expect(site.marketing.founder.name).toContain("Arthur");
    expect(site.marketing.finalCta.headline).toContain("Before you implement anything");
    expect(site.marketing.finalCta.ctaPrimary).toBe("Analyze a Problem");
  });

  it("should preserve the assessment and design partner flows", () => {
    expect(site.assessment.intro.headline).toBe("Analyze an Operational Problem");
    expect(site.designPartners.form.headline).toContain("design partner");
  });
});

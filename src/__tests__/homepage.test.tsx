import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should open on a new truth rather than a feature description", () => {
    expect(site.marketing.hero.claim).toContain("Every operational decision is a bet");
    expect(site.marketing.hero.subtitle).toContain("confidence before they spend months");
  });

  it("should position Compass around reduced decision risk, not AI", () => {
    expect(site.tagline).toBe("Make operational decisions with confidence.");
    expect(site.marketing.hero.eyebrow).toContain("Make operational decisions with confidence");
    expect(site.marketing.hero.trustLine).not.toContain("AI");
  });

  it("should establish the missing system: a decision process", () => {
    const c = site.marketing.category;
    expect(c.headline).toContain("implementation process");
    expect(c.headline).toContain("decision process");
    expect(c.resolve).toBe("Compass becomes the missing system.");
    expect(c.belief.some((b) => b.includes("more confidence"))).toBe(true);
    expect(c.model.steps).toEqual(["Problem", "Confidence", "Implementation", "Measurement", "Learning", "Better decision"]);
  });

  it("should frame the pillars as reasons to trust, in the right order", () => {
    const pillars = site.marketing.pillars.items;
    expect(pillars).toHaveLength(4);
    expect(pillars.map((p) => p.name)).toEqual(["Evidence", "Execution", "Measurement", "Compounding"]);
    expect(pillars[0].headline).toContain("Confidence comes from evidence");
    expect(pillars[1].headline).toContain("Confidence comes from execution");
    expect(pillars[2].headline).toContain("Confidence comes from measurement");
    expect(pillars[3].headline).toContain("Confidence compounds");
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

  it("should present a catalog of case studies with evidence and lessons", () => {
    expect(site.marketing.catalog.headline).toContain("Explore how organizations solved problems like yours");
    expect(site.marketing.examples.length).toBeGreaterThanOrEqual(6);
    const card = site.marketing.examples[0];
    expect(card.problem.length).toBeGreaterThan(0);
    expect(card.intervention.length).toBeGreaterThan(0);
    expect(card.evidence.comparables).toBeGreaterThan(0);
    expect(card.alternatives.length).toBeGreaterThanOrEqual(1);
  });

  it("should argue the consultants moat", () => {
    const d = site.marketing.differentiation;
    expect(d.headline).toBe("This is what consultants cannot do.");
    expect(d.columns[2].name).toBe("Compass");
    expect(d.columns[2].highlighted).toBe(true);
    expect(d.columns[2].items.some((i) => i.includes("compounds"))).toBe(true);
  });

  it("should keep the four-stage lifecycle for the product page", () => {
    const stages = site.marketing.lifecycle.stages;
    expect(stages).toHaveLength(4);
    expect(stages.map((s) => s.name)).toEqual(["Decide", "Implement", "Monitor", "Improve"]);
    expect(stages[0].status).toBe("Available now");
  });

  it("should have a founder section and final CTA", () => {
    expect(site.marketing.founder.name).toContain("Arthur");
    expect(site.marketing.founder.label).toContain("kept seeing the same mistake");
    expect(site.marketing.finalCta.headline).toContain("Before you implement anything");
    expect(site.marketing.finalCta.ctaPrimary).toBe("Analyze a Problem");
  });

  it("should preserve the assessment and design partner flows", () => {
    expect(site.assessment.intro.headline).toBe("Analyze an Operational Problem");
    expect(site.designPartners.form.headline).toContain("design partner");
  });
});

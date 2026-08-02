import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should open with a defensibility-led value proposition", () => {
    expect(site.marketing.hero.headline).toBe("Make Operational Decisions with Confidence.");
    expect(site.marketing.hero.headlineAccent).toBe("Decisions");
    expect(site.marketing.hero.eyebrow).toContain("REAL-WORLD IMPLEMENTATIONS");
    expect(site.marketing.hero.categoryLine).toContain("operating system");
    expect(site.marketing.hero.defensibility.title).toBe("Why you can trust this decision");
    expect(site.marketing.hero.defensibility.rows).toHaveLength(8);
    expect(site.marketing.hero.defensibility.rows.map((r) => r.status)).toEqual([
      "Complete",
      "Complete",
      "Complete",
      "Strong",
      "Strong",
      "Partial",
      "Partial",
      "Missing",
    ]);
  });

  it("should offer three entry paths that converge on the same engine", () => {
    const paths = site.marketing.hero.entry.paths;
    expect(paths).toHaveLength(3);
    expect(paths.map((p) => p.id)).toEqual(["analyze", "opportunities", "validate"]);
    expect(paths[0].title).toContain("Analyze an Operational Problem");
    expect(paths[1].title).toContain("Find My Biggest Improvement Opportunity");
    expect(paths[2].title).toContain("Validate an Implementation Decision");
    expect(paths[0].href).toBe("/analyze");
    expect(paths[1].href).toContain("mode=opportunities");
    expect(paths[2].href).toContain("mode=validate");
    expect(paths[0].number).toBe("01");
  });

  it("should position Compass around reduced decision risk, not AI", () => {
    expect(site.tagline).toBe("Make operational decisions with confidence.");
    expect(site.marketing.hero.supporting).toContain("decisions that move millions");
    expect(site.marketing.hero.supporting).toContain("analyzed, synthesized");
    expect(site.marketing.hero.stakes).toContain("Consultants offer opinions");
  });

  it("should establish the missing system: a decision process", () => {
    const c = site.marketing.category;
    expect(c.headline).toContain("implementation process");
    expect(c.subheadline).toBe("Very few have a decision process.");
    expect(c.thesis).toContain("Judgment remains scarce");
    expect(c.have).toContain("ERP");
    expect(c.missing).toBe("A repeatable decision process.");
    expect(c.question.compassQuestion).toContain("which intervention will work");
  });

  it("should frame consulting, rebuilt as a persistent system with a Compass column", () => {
    const c = site.marketing.consultingRebuilt;
    expect(c.headline).toContain("Consulting, rebuilt");
    expect(c.columns.map((col) => col.name)).toEqual(["Traditional consulting", "Generic AI", "Compass"]);
    expect(c.columns[2].highlighted).toBe(true);
    expect(c.columns[2].items).toContain("Reuses structured implementation intelligence");
    expect(c.prominent).toBe("Consultants make recommendations. Compass builds organizational judgment.");
  });

  it("should frame the pillars as a repeatable process, in the right order", () => {
    const pillars = site.marketing.pillars.items;
    expect(pillars).toHaveLength(4);
    expect(pillars.map((p) => p.name)).toEqual(["Evidence", "Execution", "Measurement", "Learning"]);
    expect(pillars[0].headline).toContain("Find organizations that already solved your problem");
    expect(pillars[1].headline).toContain("implementation path");
    expect(pillars[2].headline).toContain("before implementation begins");
    expect(pillars[3].headline).toContain("Every implementation improves the next decision");
  });

  it("should expose the reasoning rankings under an explore framing", () => {
    expect(site.marketing.liveRecommendation.label).toBe("Explore a decision");
    expect(site.marketing.liveRecommendation.headline).toBe("See how Compass thinks.");
    expect(site.marketing.liveRecommendation.rankings.map((r) => r.label)).toEqual([
      "Highest confidence",
      "Highest ROI",
      "Fastest to implement",
      "Highest evidence",
      "Most common",
    ]);
  });

  it("should present a catalog of similar decisions with ownership", () => {
    expect(site.marketing.catalog.headline).toContain("Organizations like yours");
    expect(site.marketing.examples.length).toBeGreaterThanOrEqual(6);
    const card = site.marketing.examples[0];
    expect(card.problem.length).toBeGreaterThan(0);
    expect(card.intervention.length).toBeGreaterThan(0);
    expect(card.evidence.comparables).toBeGreaterThan(0);
    expect(card.ownership.owner.length).toBeGreaterThan(0);
    expect(card.alternatives.length).toBeGreaterThanOrEqual(1);
  });

  it("should argue the compounding moat on the homepage", () => {
    const c = site.marketing.compounding;
    expect(c.label).toBe("Why Compass gets better");
    expect(c.headline).toBe("Every decision makes the next one better.");
    expect(c.moatLine).toBe("The moat is memory, not models.");
    expect(c.steps[0].text).toBe("Decision #17");
    expect(c.steps[c.steps.length - 1].text).toBe("Better decision");
  });

  it("should keep the full differentiation comparison on the product page", () => {
    const d = site.marketing.differentiation;
    expect(d.columns[2].name).toBe("Compass");
    expect(d.columns[2].highlighted).toBe(true);
    expect(d.moatLine).toBe("The moat is memory, not models.");
  });

  it("should use decision terminology for product outputs", () => {
    expect(site.marketing.lifecycle.stages[0].output).toBe("Decision Record");
    expect(site.marketing.lifecycle.stages[1].output).toContain("Decision Blueprint");
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

  it("should preserve the three intake modes and the design partner flow", () => {
    expect(site.assessment.intro.analyze.headline).toContain("Describe the problem");
    expect(site.assessment.intro.opportunities.cta).toBe("Start Assessment");
    expect(site.assessment.intro.validate.cta).toBe("Validate Decision");
    expect(site.assessment.intro.validate.interventions).toContain("AI");
    expect(site.designPartners.form.headline).toContain("design partner");
  });
});

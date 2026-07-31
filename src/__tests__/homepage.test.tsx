import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should open on a new truth rather than a feature description", () => {
    expect(site.marketing.hero.claim).toContain("most expensive operational mistake");
    expect(site.marketing.hero.subtitle).toContain("confidence before they spend months");
  });

  it("should offer two entry paths: describe a known problem or start guided", () => {
    expect(site.marketing.hero.pathA.title).toBe("I know my problem");
    expect(site.marketing.hero.pathA.time).toContain("minutes");
    expect(site.marketing.hero.pathB.title).toContain("not sure what");
    expect(site.marketing.hero.pathB.cta).toContain("guided");
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
    expect(c.have).toContain("ERP");
    expect(c.missing).toBe("A repeatable decision process.");
    expect(c.belief.some((b) => b.includes("more confidence"))).toBe(true);
    expect(c.model.steps).toEqual(["Problem", "Confidence", "Implementation", "Measurement", "Learning", "Better decision"]);
  });

  it("should frame the pillars as a repeatable process, in the right order", () => {
    const pillars = site.marketing.pillars.items;
    expect(pillars).toHaveLength(4);
    expect(pillars.map((p) => p.name)).toEqual(["Evidence", "Execution", "Measurement", "Compounding"]);
    expect(pillars[0].headline).toContain("Find organizations that already solved your problem");
    expect(pillars[1].headline).toContain("who does it");
    expect(pillars[2].headline).toContain("before you begin");
    expect(pillars[3].headline).toContain("Every decision makes the next one better");
  });

  it("should expose the reasoning rankings", () => {
    expect(site.marketing.liveRecommendation.label).toBe("See how Compass thinks");
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

  it("should argue the compounding moat", () => {
    const d = site.marketing.differentiation;
    expect(d.label).toBe("Why Compass gets better");
    expect(d.headline).toBe("Every decision makes the next one better.");
    expect(d.moatLine).toBe("The moat is memory, not models.");
    expect(d.columns[2].name).toBe("Compass");
    expect(d.columns[2].highlighted).toBe(true);
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

  it("should preserve the assessment (context gathering) and design partner flows", () => {
    expect(site.assessment.intro.headline).toBe("What decision are you trying to make?");
    expect(site.designPartners.form.headline).toContain("design partner");
  });
});

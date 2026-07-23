import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have eyebrow and two-line headline", () => {
    expect(site.hero.eyebrow).toBe("The decision layer before implementation");
    expect(site.hero.headline).toContain("AI is no longer optional");
    expect(site.hero.headline).toContain("Neither are good decisions");
  });

  it("should have primary and secondary CTAs", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See an example");
  });

  it("should have closing line below tags", () => {
    expect(site.hero.closing).toContain("Move before competitors");
  });

  it("should have two-risks section", () => {
    expect(site.twoRisks.left.title).toBe("Move too slowly");
    expect(site.twoRisks.right.title).toBe("Move too quickly");
    expect(site.twoRisks.bridge).toContain("move with confidence");
  });

  it("should have 4 pain cards with concise copy", () => {
    expect(site.painCards.cards).toHaveLength(4);
    site.painCards.cards.forEach((c) => {
      expect(c.label).toBeTruthy();
      expect(c.pain).toBeTruthy();
      expect(c.compassSolves).toBeTruthy();
      expect((c.pain + c.compassSolves).length).toBeLessThan(200);
    });
  });

  it("should have product question section", () => {
    expect(site.productQuestion.headline).toBe("What should your company automate next?");
    expect(site.productQuestion.cta).toBe("See Compass in action");
  });

  it("should have example with steps and confidence", () => {
    expect(site.example.steps.length).toBe(5);
    expect(site.example.confidence).toBe("87%");
  });

  it("should have 4 evidence cards with source and takeaway", () => {
    expect(site.evidence.cards).toHaveLength(4);
    expect(site.evidence.cards[0].source).toBe("Gartner");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.headline).toBe("Build the right solution first.");
    expect(site.finalCta.cta).toBe("Assess your operations");
  });
});
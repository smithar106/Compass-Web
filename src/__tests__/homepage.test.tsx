import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have clean headline", () => {
    expect(site.hero.headline).toBe("Make the right AI investment.");
  });

  it("should have bullet benefits", () => {
    expect(site.hero.bullets.length).toBe(4);
    expect(site.hero.bullets[0]).toContain("Define the right problem");
  });

  it("should have 3 decision mistakes", () => {
    expect(site.hero.decisionMistakes).toHaveLength(3);
  });

  it("should have evidence cards with colors", () => {
    expect(site.evidence.cards[0].color).toBe("emerald");
    expect(site.evidence.cards[1].color).toBe("blue");
  });

  it("should have built on evidence bar", () => {
    expect(site.trustedBy.label).toBe("Built on evidence from");
    expect(site.trustedBy.sources).toContain("Ramp");
  });

  it("should have example", () => {
    expect(site.example.confidence).toBe("87%");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });
});
import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have eyebrow and primary hook", () => {
    expect(site.hero.eyebrow).toBe("The decision layer before implementation");
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary and secondary CTAs", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See an example");
  });

  it("should have 4 recognition cards with pain and Compass solve", () => {
    expect(site.recognition.cards).toHaveLength(4);
    site.recognition.cards.forEach((c) => {
      expect(c.pain).toBeTruthy();
      expect(c.compassSolves).toBeTruthy();
    });
  });

  it("should have missing layer section", () => {
    expect(site.missingLayer.headline).toContain("judgment");
    expect(site.missingLayer.thesis).toContain("Judgment remains scarce");
  });

  it("should have example with steps and confidence", () => {
    expect(site.example.steps.length).toBe(5);
    expect(site.example.confidence).toBe("87%");
    expect(site.example.steps.some((s) => s.value?.includes("Process redesign"))).toBe(true);
  });

  it("should have 4 evidence cards with source and takeaway", () => {
    expect(site.evidence.cards).toHaveLength(4);
    expect(site.evidence.cards[0].source).toBe("Gartner");
    expect(site.evidence.cards[0].takeaway).toBeTruthy();
  });

  it("should have final CTA", () => {
    expect(site.finalCta.headline).toBe("Build the right solution first.");
    expect(site.finalCta.cta).toBe("Assess your operations");
  });

  it("should have nav with Research and Perspectives", () => {
    const labels = site.nav.map((n) => n.label);
    expect(labels).toContain("Research");
    expect(labels).toContain("Perspectives");
  });

  it("should not contain old homepage sections", () => {
    expect((site as any).pain).toBeUndefined();
    expect((site as any).compassFlow).toBeUndefined();
  });
});
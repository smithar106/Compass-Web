import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have primary hook as headline", () => {
    expect(site.hero.headline).toBe("What should your company automate next?");
  });

  it("should have primary CTA", () => {
    expect(site.hero.cta).toBe("Assess your operations");
    expect(site.hero.ctaSecondary).toBe("See Compass in action");
  });

  it("should list intervention options", () => {
    expect(site.hero.options).toContain("AI");
    expect(site.hero.options).toContain("Software");
    expect(site.hero.options).toContain("Human Work");
    expect(site.hero.options).toContain("No automation yet");
  });

  it("should have recognition section with checklist items", () => {
    expect(site.recognition.items.length).toBe(5);
    expect(site.recognition.bridge).toContain("Compass was built for you");
  });

  it("should have 4 pain cards with 3 sentences each", () => {
    expect(site.pain.cards).toHaveLength(4);
    site.pain.cards.forEach((card) => {
      expect(card.headline).toBeTruthy();
      expect(card.pain).toBeTruthy();
      expect(card.compassSolves).toBeTruthy();
    });
  });

  it("should have compass flow with 5 steps", () => {
    expect(site.compassFlow.steps).toHaveLength(5);
    const labels = site.compassFlow.steps.map((s) => s.label);
    expect(labels).toEqual(["Problem", "Investigation", "Comparison", "Recommendation", "Blueprint"]);
  });

  it("should have compact example section", () => {
    expect(site.example.headline).toBe("See it in action.");
    expect(site.example.recommendation).toContain("Don't buy an AI agent");
    expect(site.example.confidence).toBe("87%");
  });

  it("should have evidence stats section", () => {
    expect(site.evidence.headline).toBe("Why now?");
    expect(site.evidence.body).toContain("better decisions");
  });

  it("should have design partners", () => {
    expect(site.designPartners.cta).toBe("Become a design partner");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });
});
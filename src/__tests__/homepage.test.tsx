import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have direction-before-implementation headline", () => {
    expect(site.hero.headline).toContain("Determine the right direction");
    expect(site.hero.headline).toContain("before implementation");
  });

  it("should have 4 decision mistakes", () => {
    expect(site.hero.decisionMistakes).toHaveLength(4);
    const labels = site.hero.decisionMistakes.map((c) => c.label);
    expect(labels).toContain("Started with a solution");
    expect(labels).toContain("Premature implementation");
  });

  it("should have evidence cards with direction-based framing", () => {
    expect(site.evidence.cards[0].meaning).toContain("before the right direction");
    expect(site.evidence.cards[3].meaning).toContain("direction is set");
  });

  it("should have example", () => {
    expect(site.example.confidence).toBe("87%");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Start an investigation");
  });
});
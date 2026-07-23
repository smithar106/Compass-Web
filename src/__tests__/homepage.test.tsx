import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have headline about best implementation decision", () => {
    expect(site.hero.headline).toContain("best implementation decision possible");
  });

  it("should have 4 decision mistakes with Traditional approach", () => {
    expect(site.hero.decisionMistakes).toHaveLength(4);
    const labels = site.hero.decisionMistakes.map((c) => c.label);
    expect(labels).toContain("Traditional approach");
  });

  it("should have evidence cards with self-contained statistics", () => {
    expect(site.evidence.cards[0].meaning).toContain("52%");
    expect(site.evidence.cards[0].source).toBe("Gartner");
  });

  it("should have example", () => {
    expect(site.example.confidence).toBe("87%");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Start an investigation");
  });
});
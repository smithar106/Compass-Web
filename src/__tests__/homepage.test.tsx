import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have headline about deciding what to implement", () => {
    expect(site.hero.headline).toContain("deciding what should be implemented");
  });

  it("should have 4 decision mistakes", () => {
    expect(site.hero.decisionMistakes).toHaveLength(4);
  });

  it("should have evidence with meaning-first format", () => {
    expect(site.evidence.cards[0].meaning).toContain("More than half");
    expect(site.evidence.cards[3].value).toBe("8 mo.");
  });

  it("should have example unchanged", () => {
    expect(site.example.steps.length).toBe(5);
    expect(site.example.confidence).toBe("87%");
  });

  it("should have final CTA", () => {
    expect(site.finalCta.cta).toBe("Assess your operations");
  });
});
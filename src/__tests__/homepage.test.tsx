import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("Homepage content", () => {
  it("should have headline about deciding what should be implemented", () => {
    expect(site.hero.headline).toContain("deciding what should be implemented");
  });

  it("should have bridge sentence", () => {
    expect(site.hero.bridge).toContain("implement the wrong solution");
  });

  it("should have 4 decision mistakes with multi-line pain", () => {
    expect(site.hero.decisionMistakes).toHaveLength(4);
    expect(site.hero.decisionMistakes[0].pain).toContain("\n");
  });

  it("should have evidence cards with meaning-first format", () => {
    expect(site.evidence.cards).toHaveLength(4);
    expect(site.evidence.cards[0].meaning).toContain("More than half");
    expect(site.evidence.cards[0].connection).toBeTruthy();
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
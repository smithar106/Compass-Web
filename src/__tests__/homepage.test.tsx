import { describe, it, expect } from "vitest";
import { site } from "@/content/site";
import { mockResults } from "@/data/mock-results";

describe("Homepage content", () => {
  it("should have hero headline defined", () => {
    expect(site.hero.headline).toBeDefined();
    expect(site.hero.headline.length).toBeGreaterThan(0);
  });

  it("should have hero CTA defined", () => {
    expect(site.hero.cta).toBeDefined();
    expect(site.hero.cta).toBe("Start your assessment");
  });

  it("should have problem section defined", () => {
    expect(site.problem.headline).toBeDefined();
    expect(site.problem.body).toBeDefined();
  });

  it("should have 3 how-it-works steps", () => {
    expect(site.howItWorks.steps).toHaveLength(3);
  });

  it("should have site name defined", () => {
    expect(site.name).toBe("Compass");
  });

  it("should have navigation links", () => {
    expect(site.nav.length).toBeGreaterThanOrEqual(4);
  });

  it("should have mock results with 5 opportunities", () => {
    expect(mockResults.opportunities).toHaveLength(5);
  });

  it("should have footer columns", () => {
    expect(site.footer.columns.length).toBeGreaterThanOrEqual(3);
  });

  it("should have differentiation comparisons", () => {
    expect(site.differentiation.comparisons.length).toBeGreaterThanOrEqual(4);
  });

  it("should have final CTA section", () => {
    expect(site.finalCta.headline).toBeDefined();
    expect(site.finalCta.cta).toBeDefined();
  });
});

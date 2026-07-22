import { describe, it, expect } from "vitest";
import { questions } from "@/data/assessment-questions";

describe("Assessment questions", () => {
  it("should have exactly 25 questions", () => {
    expect(questions).toHaveLength(25);
  });

  it("each question should have required fields", () => {
    for (const q of questions) {
      expect(q.id).toBeDefined();
      expect(typeof q.id).toBe("number");
      expect(q.section).toBeDefined();
      expect(typeof q.section).toBe("string");
      expect(q.question).toBeDefined();
      expect(typeof q.question).toBe("string");
      expect(q.type).toBeDefined();
      expect(["boolean", "scale", "multi-choice", "open"]).toContain(q.type);
    }
  });

  it("scale and multi-choice questions should have options", () => {
    for (const q of questions) {
      if (q.type === "scale" || q.type === "multi-choice") {
        expect(q.options).toBeDefined();
        expect(q.options!.length).toBeGreaterThan(0);
      }
    }
  });

  it("boolean questions should not have options", () => {
    for (const q of questions) {
      if (q.type === "boolean") {
        expect(q.options).toBeUndefined();
      }
    }
  });

  it("should have questions in 10 sections", () => {
    const sections = new Set(questions.map((q) => q.section));
    expect(sections.size).toBe(10);
    expect(sections).toContain("Sales");
    expect(sections).toContain("Marketing");
    expect(sections).toContain("Customer Success");
    expect(sections).toContain("Support");
    expect(sections).toContain("Finance");
    expect(sections).toContain("Product");
    expect(sections).toContain("Engineering");
    expect(sections).toContain("People/HR");
    expect(sections).toContain("Legal");
    expect(sections).toContain("Operations");
  });

  it("Sales section should have 3 questions", () => {
    const salesQuestions = questions.filter((q) => q.section === "Sales");
    expect(salesQuestions).toHaveLength(3);
  });

  it("Support section should have 3 questions", () => {
    const supportQuestions = questions.filter((q) => q.section === "Support");
    expect(supportQuestions).toHaveLength(3);
  });

  it("Finance section should have 2 questions", () => {
    const financeQuestions = questions.filter((q) => q.section === "Finance");
    expect(financeQuestions).toHaveLength(2);
  });
});

import { describe, it, expect } from "vitest";
import { questions } from "@/data/assessment-questions";

describe("Assessment questions", () => {
  it("should have questions defined", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("each question should have required fields", () => {
    for (const q of questions) {
      expect(q.id).toBeDefined();
      expect(typeof q.id).toBe("string");
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

  it("should have questions in multiple sections", () => {
    const sections = new Set(questions.map((q) => q.section));
    expect(sections.size).toBeGreaterThanOrEqual(4);
  });

  it("should have category field for each question", () => {
    for (const q of questions) {
      expect(q.category).toBeDefined();
      expect(typeof q.category).toBe("string");
    }
  });

  it("questions should cover diverse categories", () => {
    const categories = new Set(questions.map((q) => q.category));
    expect(categories.size).toBeGreaterThanOrEqual(4);
    const expected = ["department", "workflow", "pain", "frequency", "tools", "cost", "risk", "constraints"];
    for (const cat of expected) {
      if (categories.has(cat)) {
        // At least one question matches this category
        expect(questions.filter((q) => q.category === cat).length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("questions should not ask users to design AI solutions", () => {
    const forbidden = ["build an AI", "create an AI", "design an AI", "train a model", "implement AI"];
    for (const q of questions) {
      for (const phrase of forbidden) {
        expect(q.question.toLowerCase()).not.toContain(phrase);
      }
    }
  });

  it("questions should be business-problem focused", () => {
    const focused = ["workflow", "process", "outcome", "pain", "problem", "challenge", "currently"];
    const anyFocused = questions.some((q) =>
      focused.some((f) => q.question.toLowerCase().includes(f))
    );
    expect(anyFocused).toBe(true);
  });
});
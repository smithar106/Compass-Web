import { describe, it, expect } from "vitest";
import {
  CANONICAL_PATHWAYS,
  canonicalizePathway,
  PATHWAY_LABELS,
} from "@/data/pathway-taxonomy";

describe("pathway taxonomy", () => {
  it("has exactly the canonical enum with stable labels", () => {
    expect(CANONICAL_PATHWAYS).toEqual([
      "AI",
      "Workflow_Automation",
      "Software",
      "Process_Redesign",
      "Staffing",
      "Hybrid",
      "No_Action",
    ]);
    expect(PATHWAY_LABELS.AI).toBe("AI");
    expect(PATHWAY_LABELS.Workflow_Automation).toBe("Workflow Automation");
    expect(PATHWAY_LABELS.No_Action).toBe("No Action");
  });

  it("canonicalizes engine aliases onto the enum", () => {
    const cases: Array<[unknown, string]> = [
      ["AI Implementation", "AI"],
      ["ai chatbot", "AI"],
      ["Workflow Automation", "Workflow_Automation"],
      ["workflow_automation", "Workflow_Automation"],
      ["process automation", "Workflow_Automation"],
      ["Deterministic Software", "Software"],
      ["Process_Redesign", "Process_Redesign"],
      ["Process Redesign", "Process_Redesign"],
      ["Human Work", "Staffing"],
      ["No Action", "No_Action"],
      ["do nothing", "No_Action"],
      ["AI Implementation plan", "AI"],
    ];
    for (const [input, expected] of cases) {
      expect(canonicalizePathway(input)).toBe(expected);
    }
  });

  it("handles arbitrary case and whitespace", () => {
    expect(canonicalizePathway("  AI-POWERED  ")).toBe("AI");
    expect(canonicalizePathway("hybrid intervention")).toBe("Hybrid");
    expect(canonicalizePathway("Process- Redesign")).toBe("Process_Redesign");
  });

  it("returns the raw value for unknown pathways rather than inventing one", () => {
    expect(canonicalizePathway("Quark Processing")).toBe("Quark Processing");
    expect(canonicalizePathway("")).toBe("No_Action");
  });
});

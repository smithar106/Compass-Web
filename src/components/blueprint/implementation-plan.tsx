"use client";

import { useState } from "react";
import type { ImplementationBlueprint } from "@/types";

interface ImplementationBlueprintViewProps {
  blueprint: ImplementationBlueprint;
}

const pathLabel: Record<string, string> = {
  "AI": "AI",
  "Deterministic Software": "Software",
  "Process Redesign": "Process",
  "Human Work": "Human",
  "Hybrid": "Hybrid",
  "No Action": "Not ready",
};

interface BlueprintSectionDef {
  heading: string;
  content: string;
  details?: string[];
  technical?: string[];
  techOnly?: boolean;
}

const opLeaderSections = new Set([
  "Problem",
  "Root cause",
  "Recommended intervention",
  "Alternatives considered",
  "Why this path won",
  "Current workflow",
  "Future workflow",
  "Expected impact",
  "Rollout phases",
  "Success metrics",
  "Risks",
  "Assumptions",
  "Ownership",
]);

export function ImplementationPlanView({ blueprint }: ImplementationBlueprintViewProps) {
  const [activeSection, setActiveSection] = useState<string>("Problem");
  const [showTechView, setShowTechView] = useState(false);

  const sections: BlueprintSectionDef[] = [
    {
      heading: "Problem",
      content: blueprint.problem,
    },
    {
      heading: "Root cause",
      content: blueprint.rootCause,
    },
    {
      heading: "Recommended intervention",
      content: blueprint.recommendedIntervention.description,
      details: [blueprint.recommendedIntervention.businessCase],
      technical: [`Type: ${blueprint.recommendedIntervention.type}`, `Implementation effort: ${blueprint.recommendedIntervention.implementationEffort}`],
    },
    {
      heading: "Alternatives considered",
      content: blueprint.alternativesConsidered,
    },
    {
      heading: "Why this path won",
      content: blueprint.whyThisPathWon,
    },
    {
      heading: "Current workflow",
      content: "",
      details: blueprint.currentWorkflow,
    },
    {
      heading: "Future workflow",
      content: "",
      details: blueprint.futureWorkflow,
    },
    {
      heading: "Required systems",
      content: "",
      details: blueprint.requiredSystems,
      technical: blueprint.requiredSystems,
      techOnly: false,
    },
    {
      heading: "Required APIs",
      content: "",
      details: blueprint.requiredApis,
      technical: blueprint.requiredApis,
      techOnly: false,
    },
    {
      heading: "Required data",
      content: "",
      details: blueprint.requiredData,
      technical: blueprint.requiredData,
      techOnly: false,
    },
    {
      heading: "Human roles",
      content: "",
      details: blueprint.humanRoles,
    },
    {
      heading: "Ownership",
      content: blueprint.ownership || `${blueprint.recommendedIntervention.type} implementation team`,
    },
    {
      heading: "Security and privacy",
      content: "",
      details: blueprint.securityAndPrivacy,
      technical: blueprint.securityAndPrivacy,
      techOnly: false,
    },
    {
      heading: "Rollout phases",
      content: "",
      details: blueprint.rolloutPlan,
    },
    {
      heading: "Validation plan",
      content: "",
      details: blueprint.validationPlan || ["Compare outcomes against baseline metrics", "Review at predefined milestones", "Adjust approach based on early results"],
    },
    {
      heading: "Success metrics",
      content: "",
      details: blueprint.successMetrics,
    },
    {
      heading: "Risks",
      content: "",
      details: blueprint.risksAndAssumptions.filter((r) => r.toLowerCase().includes("risk") || r.toLowerCase().includes("adopt") || r.toLowerCase().includes("capacity")),
    },
    {
      heading: "Assumptions",
      content: "",
      details: blueprint.risksAndAssumptions.filter((r) => !r.toLowerCase().includes("risk") && !r.toLowerCase().includes("adopt") && !r.toLowerCase().includes("capacity")),
    },
    {
      heading: "Expected impact",
      content: blueprint.expectedImpact,
    },
    {
      heading: "Technical escalation level",
      content: blueprint.technicalEscalationLevel,
      techOnly: true,
    },
  ];

  const visibleSections = showTechView
    ? sections
    : sections.filter((s) => opLeaderSections.has(s.heading) || s.heading === "Validation plan" || s.heading === "Rollout phases" || s.heading === "Security and privacy");

  const currentSection = sections.find((s) => s.heading === activeSection) || sections[0];

  const isCurrentlyTechOnly = (heading: string) => {
    const s = sections.find((sec) => sec.heading === heading);
    return s?.techOnly === true;
  };

  const isTechnical = (heading: string) =>
    ["Required systems", "Required APIs", "Required data", "Security and privacy"].includes(heading);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-mist/30 border-b border-border">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-xs font-semibold text-ink">Implementation Plan</span>
        </div>
        <button
          onClick={() => setShowTechView(!showTechView)}
          className="text-xs text-forest hover:text-leaf font-medium px-2 py-1 rounded hover:bg-forest/5 transition-colors"
        >
          {showTechView ? "Show operations view" : "Show technical details"}
        </button>
      </div>

      {showTechView && (
        <div className="bg-ink text-cream/80 text-[10px] px-4 py-1.5">
          Technical view &mdash; additional detail sections visible for engineering and implementation teams.
        </div>
      )}

      <div className="bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-0">
          {visibleSections.map((section) => (
            <button
              key={section.heading}
              onClick={() => setActiveSection(section.heading)}
              className={`px-3 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeSection === section.heading
                  ? "border-forest text-forest bg-mist/20"
                  : "border-transparent text-stone hover:text-ink hover:border-stone/30"
              }`}
            >
              {section.heading}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-subhead font-semibold text-ink">{currentSection.heading}</h3>
          <div className="flex items-center gap-2">
            {isTechnical(currentSection.heading) && showTechView && (
              <span className="text-[10px] text-stone bg-mist px-1.5 py-0.5 rounded">Technical</span>
            )}
          </div>
        </div>

        {currentSection.content && (
          <p className="text-sm text-stone leading-relaxed mb-4">{currentSection.content}</p>
        )}

        {currentSection.details && currentSection.details.length > 0 && (
          <ul className="space-y-2">
            {currentSection.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 flex-shrink-0" />
                <span className="text-stone">{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {isTechnical(currentSection.heading) && showTechView && currentSection.technical && currentSection.technical.length > 0 && (
          <div className="mt-4 p-3 bg-ink rounded-lg">
            <p className="text-xs text-cream font-medium mb-2">Implementation details</p>
            <ul className="space-y-1">
              {currentSection.technical.map((item, i) => (
                <li key={i} className="text-xs text-stone font-mono">- {item}</li>
              ))}
            </ul>
          </div>
        )}

        {isCurrentlyTechOnly(currentSection.heading) && !showTechView && (
          <div className="p-4 bg-mist/50 border border-dashed border-border rounded-lg text-center">
            <p className="text-xs text-stone">
              This section contains technical implementation details.
              <button
                onClick={() => setShowTechView(true)}
                className="ml-1 text-forest hover:text-leaf font-medium"
              >
                Switch to technical view
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

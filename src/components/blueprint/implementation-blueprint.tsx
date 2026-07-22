"use client";

import { useState } from "react";
import type { ImplementationBlueprint } from "@/types";

interface ImplementationBlueprintViewProps {
  blueprint: ImplementationBlueprint;
}

export function ImplementationBlueprintView({ blueprint }: ImplementationBlueprintViewProps) {
  const [activeSection, setActiveSection] = useState<string>(blueprint.sections?.[0]?.heading || "Problem");
  const [showTechnical, setShowTechnical] = useState(false);

  const defaultSections = [
    { heading: "Problem", content: blueprint.problem },
    { heading: "Root cause", content: blueprint.rootCause },
    { heading: "Recommended intervention", content: blueprint.recommendedIntervention.description, details: [blueprint.recommendedIntervention.businessCase] },
    { heading: "Alternatives considered", content: blueprint.alternativesConsidered },
    { heading: "Why this path won", content: blueprint.whyThisPathWon },
    { heading: "Current workflow", content: "", details: blueprint.currentWorkflow },
    { heading: "Future workflow", content: "", details: blueprint.futureWorkflow },
    { heading: "Required systems", content: "", details: blueprint.requiredSystems, technical: blueprint.requiredSystems },
    { heading: "Required APIs", content: "", details: blueprint.requiredApis, technical: blueprint.requiredApis },
    { heading: "Required data", content: "", details: blueprint.requiredData, technical: blueprint.requiredData },
    { heading: "Human roles", content: "", details: blueprint.humanRoles },
    { heading: "Security and privacy", content: "", details: blueprint.securityAndPrivacy, technical: blueprint.securityAndPrivacy },
    { heading: "Rollout plan", content: "", details: blueprint.rolloutPlan },
    { heading: "Success metrics", content: "", details: blueprint.successMetrics },
    { heading: "Risks and assumptions", content: "", details: blueprint.risksAndAssumptions },
    { heading: "Expected impact", content: blueprint.expectedImpact },
    { heading: "Technical escalation level", content: blueprint.technicalEscalationLevel },
  ];

  const sections = blueprint.sections?.length ? blueprint.sections : defaultSections;

  const currentSection = sections.find((s) => s.heading === activeSection) || sections[0];

  const isTechnical = (heading: string) =>
    ["Required systems", "Required APIs", "Required data", "Security and privacy"].includes(heading);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-0">
          {sections.map((section) => (
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

      {/* Content */}
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-subhead font-semibold text-ink">{currentSection.heading}</h3>
          {isTechnical(currentSection.heading) && (
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="text-xs text-forest hover:text-leaf font-medium"
            >
              {showTechnical ? "Show business view" : "Show technical details"}
            </button>
          )}
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

        {isTechnical(currentSection.heading) && showTechnical && currentSection.technical && currentSection.technical.length > 0 && (
          <div className="mt-4 p-3 bg-ink rounded-lg">
            <p className="text-xs text-cream font-medium mb-2">Technical details</p>
            <ul className="space-y-1">
              {currentSection.technical.map((item, i) => (
                <li key={i} className="text-xs text-stone font-mono">- {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
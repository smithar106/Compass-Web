"use client";

import type { OrganizationalProfile } from "@/types/pipeline";
import { cn } from "@/lib/utils";

interface OrgIntelligenceProps {
  profile?: OrganizationalProfile | null;
}

const dimensionConfig = {
  decisionVelocity: { label: "Decision Velocity", description: "How quickly your organization evaluates and acts on new opportunities." },
  knowledgeFragmentation: { label: "Knowledge Fragmentation", description: "How information is distributed across tools, teams, and individuals." },
  workflowStandardization: { label: "Workflow Standardization", description: "How consistently processes are documented and followed." },
  aiReadiness: { label: "AI Readiness", description: "Technical and cultural readiness for AI adoption." },
  automationMaturity: { label: "Automation Maturity", description: "Current state of automation across operations." },
  documentationQuality: { label: "Documentation Quality", description: "Completeness and accuracy of process documentation." },
  crossFunctionalCoordination: { label: "Cross-Functional Coordination", description: "How effectively departments share information and align." },
};

const scoreToLabel = (score: number): { label: string; color: string } => {
  if (score <= 2) return { label: "Very Low", color: "bg-red-400" };
  if (score <= 4) return { label: "Low", color: "bg-red-500" };
  if (score <= 6) return { label: "Moderate", color: "bg-amber-500" };
  if (score <= 8) return { label: "High", color: "bg-forest" };
  return { label: "Very High", color: "bg-leaf" };
};

export function OrgIntelligenceView({ profile }: OrgIntelligenceProps) {
  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-stone text-sm">Complete an organizational discovery to see your intelligence profile.</p>
      </div>
    );
  }

  const entries = Object.entries(dimensionConfig) as [keyof OrganizationalProfile, { label: string; description: string }][];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-heading font-bold text-ink">How Compass Understands Your Organization</h2>
        <p className="mt-2 text-body text-stone">
          Before making recommendations, we build a profile of your organization across seven dimensions.
          This intelligence governs how we weigh evidence, prioritize opportunities, and estimate feasibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([key, config]) => {
          const dim = profile[key];
          const sl = scoreToLabel(dim.score);
          const pct = (dim.score / 10) * 100;

          return (
            <div key={key} className="border border-border rounded-lg p-5 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-ink">{config.label}</h3>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded text-white", sl.color)}>
                  {sl.label}
                </span>
              </div>
              <p className="text-xs text-stone mb-3">{config.description}</p>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", sl.color)} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-stone">Score: {dim.score}/10</span>
              </div>
              <p className="mt-2 text-sm text-ink">{dim.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-mist border border-border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-ink mb-2">Why This Matters</h3>
        <p className="text-sm text-stone leading-relaxed">
          These dimensions directly influence how Compass ranks opportunities.
          Organizations with lower workflow standardization receive recommendations that include process documentation prerequisites.
          Higher knowledge fragmentation increases the weight of centralized knowledge base recommendations.
          AI readiness scores adjust implementation complexity estimates.
          This is not a static profile — it evolves as your organization matures.
        </p>
      </div>
    </div>
  );
}

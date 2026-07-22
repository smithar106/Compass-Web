"use client";

import type { EnrichedOpportunity } from "@/types/pipeline";
import { cn } from "@/lib/utils";

interface WhyNotPanelProps {
  opportunities: EnrichedOpportunity[];
}

export function WhyNotPanel({ opportunities }: WhyNotPanelProps) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="border-t border-border pt-8">
        <h2 className="text-subhead font-semibold text-ink mb-2">
          Considered But Not Recommended
        </h2>
        <p className="text-sm text-stone mb-6">
          We evaluated these opportunities but did not recommend them. Here is why.
          This is the analysis most consultancies and AI tools never share.
        </p>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.candidate.id} className="border border-border rounded-lg bg-white overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone font-medium uppercase tracking-wider">{opp.candidate.department}</p>
                    <h3 className="text-lg font-semibold text-ink mt-0.5">{opp.candidate.title}</h3>
                  </div>
                  <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Not Recommended
                  </span>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">Why we did not recommend this</h4>
                  <ul className="space-y-1.5">
                    {opp.disqualifiers.map((d, i) => (
                      <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">&#x2022;</span>
                        {d}
                      </li>
                    ))}
                    {opp.feasibility.details.map((d, i) => (
                      <li key={`fe-${i}`} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">&#x2022;</span>
                        {d}
                      </li>
                    ))}
                    {opp.businessLeverage.details
                      .filter((d) => d.toLowerCase().includes("limited") || d.toLowerCase().includes("insufficient"))
                      .map((d, i) => (
                        <li key={`bl-${i}`} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">&#x2022;</span>
                          {d}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {opp.candidate.risks.map((risk, i) => (
                    <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                      {risk}
                    </span>
                  ))}
                  {opp.candidate.dependencies.map((dep, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                      Prerequisite: {dep}
                    </span>
                  ))}
                </div>

                {(opp.feasibility.score > 0 || opp.businessLeverage.score > 0) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Scores</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-stone">Feasibility: </span>
                        <span className={opp.feasibility.label === "pass" ? "text-forest" : opp.feasibility.label === "conditional" ? "text-amber-600" : "text-red-600"}>
                          {opp.feasibility.score}/{opp.feasibility.maxScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone">Leverage: </span>
                        <span className={opp.businessLeverage.label === "pass" ? "text-forest" : opp.businessLeverage.label === "conditional" ? "text-amber-600" : "text-red-600"}>
                          {opp.businessLeverage.score}/{opp.businessLeverage.maxScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone">Readiness: </span>
                        <span className={opp.implementationReadiness.label === "pass" ? "text-forest" : opp.implementationReadiness.label === "conditional" ? "text-amber-600" : "text-red-600"}>
                          {opp.implementationReadiness.score}/{opp.implementationReadiness.maxScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone">Alignment: </span>
                        <span className="text-forest">{opp.strategicAlignment.score}/{opp.strategicAlignment.maxScore}</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs text-stone italic">
                  We will re-evaluate this opportunity as your organization's capabilities and data quality improve.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

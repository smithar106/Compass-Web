"use client";

import { useState } from "react";

interface ComparableEvidence {
  organization: string;
  industry: string;
  workflow: string;
  intervention: string;
  outcome: string;
  status: string;
  similarity_score: number;
  evidence_score: number;
  evidence_tier: string;
  supporting_passage: string;
  source_title: string;
  source_url: string;
}

interface Props {
  comparables: ComparableEvidence[];
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    gold: "bg-yellow-50 text-yellow-800",
    silver: "bg-gray-100 text-gray-600",
    bronze: "bg-orange-50 text-orange-800",
    rejected: "bg-red-50 text-red-600",
  };
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${colors[tier] || "bg-gray-50 text-gray-500"}`}>
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    successful: "text-green-700",
    partial: "text-amber-700",
    failed: "text-red-700",
    abandoned: "text-red-700",
  };
  return <span className={`text-xs font-medium ${colors[status] || "text-gray-500"}`}>{status}</span>;
}

export function EvidenceTable({ comparables }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const visible = comparables.filter((c) => c.evidence_tier !== "rejected");

  if (!visible.length) return null;

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Supporting Evidence</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Workflow</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Outcome</th>
              <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
              <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Similarity</th>
              <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((c, i) => (
              <tr
                key={i}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-3 py-2.5 text-sm font-medium text-ink">{c.organization}</td>
                <td className="px-3 py-2.5 text-xs text-gray-500">{c.industry}</td>
                <td className="px-3 py-2.5 text-xs text-gray-500">{c.workflow || c.intervention}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700 max-w-[200px] truncate">{c.outcome}</td>
                <td className="px-3 py-2.5 text-center"><TierBadge tier={c.evidence_tier} /></td>
                <td className="px-3 py-2.5 text-center text-sm font-mono text-ink">{Math.round(c.evidence_score)}</td>
                <td className="px-3 py-2.5 text-center text-sm font-mono text-ink">{Math.round(c.similarity_score)}%</td>
                <td className="px-3 py-2.5 text-center"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expanded !== null && visible[expanded] && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          <ExpandedRow evidence={visible[expanded]} />
        </div>
      )}
    </div>
  );
}

function ExpandedRow({ evidence }: { evidence: ComparableEvidence }) {
  return (
    <div className="space-y-3 text-sm">
      {evidence.supporting_passage && (
        <div>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Supporting Passage</span>
          <p className="text-sm text-ink leading-relaxed border-l-2 border-gray-300 pl-3 italic">
            {evidence.supporting_passage}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {evidence.source_title && (
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">Source</span>
            {evidence.source_url ? (
              <a href={evidence.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-lime-600 hover:underline">
                {evidence.source_title}
              </a>
            ) : (
              <span className="text-sm text-ink">{evidence.source_title}</span>
            )}
          </div>
        )}
        {evidence.outcome && (
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">Observed Metrics</span>
            <span className="text-sm text-ink">{evidence.outcome}</span>
          </div>
        )}
      </div>
    </div>
  );
}

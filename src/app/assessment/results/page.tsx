"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OpportunityCard } from "@/components/home/opportunity-card";
import { mockResults } from "@/data/mock-results";
import { site } from "@/content/site";

const STORAGE_KEY = "compass-assessment-session";

export default function ResultsPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      router.replace("/assessment");
      return;
    }
    try {
      const session = JSON.parse(stored);
      if (!session.completed) {
        router.replace("/assessment");
        return;
      }
    } catch {
      router.replace("/assessment");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-stone text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-heading font-bold text-ink">{site.results.headline}</h1>
          <p className="mt-3 text-body text-stone">{site.results.subtitle}</p>
          <p className="mt-1 text-sm text-stone/60">
            Based on assessment for <span className="font-medium text-ink">{mockResults.companyName}</span>
          </p>
        </div>

        <div className="space-y-4">
          {mockResults.opportunities.map((opp) => (
            <OpportunityCard key={opp.rank} opportunity={opp} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => setShowToast(true)}
            className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
          >
            {site.results.buildBrief}
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-ink text-cream px-6 py-3 rounded-lg shadow-lg text-sm">
            {site.results.comingSoon}
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-stone hover:text-cream transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

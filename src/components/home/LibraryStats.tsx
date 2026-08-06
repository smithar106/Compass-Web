"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CoverageHeadline {
  organizations?: number;
  industries?: number;
}

export interface LibraryStatCell {
  value: string;
  label: string;
}

interface LibraryStatsProps {
  className?: string;
  /** Optional extra stat cells rendered after the live library numbers. */
  extraCells?: LibraryStatCell[];
  /** Larger numerals for section-level proofs. */
  size?: "sm" | "lg";
}

/**
 * Live evidence-library numbers, fetched from the coverage API. Renders
 * nothing when the API is unavailable — no fabricated fallback figures.
 */
export function LibraryStats({ className, extraCells = [], size = "sm" }: LibraryStatsProps) {
  const [headline, setHeadline] = useState<CoverageHeadline | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/coverage", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (alive) setHeadline(data?.headline ?? null);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (failed || !headline || headline.organizations == null) return null;

  const cells: LibraryStatCell[] = [
    { value: headline.organizations.toLocaleString("en-US"), label: "organizations in the evidence library" },
    { value: headline.industries?.toLocaleString("en-US") ?? "—", label: "industries covered" },
    ...extraCells,
  ];

  return (
    <dl className={cn("flex flex-wrap items-start justify-center gap-x-12 gap-y-6", className)}>
      {cells.map((cell) => (
        <div key={cell.label} className="text-center">
          <dd
            className={cn(
              "font-extrabold tracking-tight text-ink",
              size === "lg" ? "text-[44px] leading-none" : "text-[30px] leading-none"
            )}
          >
            {cell.value}
          </dd>
          <dt className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {cell.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

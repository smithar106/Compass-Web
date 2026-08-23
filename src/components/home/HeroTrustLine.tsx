"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Headline {
  implementations?: number;
  organizations?: number;
  industries?: number;
}

/**
 * Hero trust line. Fetches live evidence-library numbers from /api/coverage.
 * When the API is unavailable it falls back to the supported, real figure of
 * 10,000+ verified implementation records — never an invented number.
 */
export function HeroTrustLine({ className }: { className?: string }) {
  const [headline, setHeadline] = useState<Headline | null>(null);
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

  const n = Number(headline?.implementations);
  const has = Number.isFinite(n) && n > 0;

  const fmt = (v: number) => v.toLocaleString("en-US");
  const count = has ? fmt(n) : "10,000+";
  const detail = has && headline?.organizations ? ` · ${fmt(headline.organizations)} organizations` : "";

  return (
    <div className={cn("text-[12px] font-medium text-muted", className)}>
      Built from <span className="font-bold text-ink">{count} verified implementation records</span>
      <span className="text-faint"> and growing{detail}</span>
      {!failed && !has && <span className="text-faint" />}
    </div>
  );
}

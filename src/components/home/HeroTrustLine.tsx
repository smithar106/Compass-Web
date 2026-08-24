"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Headline {
  implementations?: number;
  organizations?: number;
  industries?: number;
}

/**
 * Hero trust line. The corpus reference is 10,000+ verified implementation
 * records (the validated corpus). When the coverage API is available the live
 * organization count is shown alongside; the record count is always the
 * supported "10,000+" figure — never the raw collector total.
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

  const orgs = Number(headline?.organizations);
  const hasOrgs = Number.isFinite(orgs) && orgs > 0;

  const fmt = (v: number) => v.toLocaleString("en-US");
  const detail = hasOrgs ? ` · ${fmt(orgs)} organizations` : "";

  return (
    <div className={cn("text-[12px] font-medium text-muted", className)}>
      Built from{" "}
      <span className="font-bold text-ink">10,000+ verified implementation records</span>
      <span className="text-faint"> and growing{detail}</span>
      {!failed && !hasOrgs && <span className="text-faint" />}
    </div>
  );
}

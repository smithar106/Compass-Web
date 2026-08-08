"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const DEMO_TABS = [
  { label: "Overview", href: "/demo" },
  { label: "Decisions", href: "/demo/decisions" },
  { label: "Intelligence", href: "/demo/intelligence" },
  { label: "Outcomes", href: "/demo/outcomes" },
] as const;

export function DemoNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Demo" className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-5 sm:px-8">
        {DEMO_TABS.map((tab) => {
          const active =
            tab.href === "/demo"
              ? pathname === "/demo"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-3 text-[13.5px] font-medium transition-colors",
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:border-line hover:text-ink"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

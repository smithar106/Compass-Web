"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep";

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Application" className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-5 sm:px-8">
        {APP_NAV.map((item) => {
          const active =
            item.href === "/workspace"
              ? pathname === "/workspace"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-3 text-[13.5px] font-medium transition-colors",
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:border-line hover:text-ink",
                FOCUS
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

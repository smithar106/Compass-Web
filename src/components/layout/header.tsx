"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { name } from "@/content/marketing";
import { PUBLIC_NAV, PUBLIC_NAV_CTA } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ArrowIcon, Needle } from "@/components/home/primitives";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close the mobile menu with Escape (keyboard navigation support).
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[68px] lg:px-10">
        <Link
          href="/"
          className={cn("group flex items-center gap-2.5 rounded-sm", FOCUS)}
          aria-label={`${name} home`}
        >
          <Needle className="h-6 w-6 text-ink transition-transform duration-300 group-hover:rotate-45" />
          <span className="text-[19px] font-bold tracking-tight text-ink">{name}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("rounded-sm text-[13.5px] font-medium text-muted transition-colors hover:text-ink", FOCUS)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={PUBLIC_NAV_CTA.href}
            className={cn(
              "group inline-flex items-center gap-2 bg-ink px-4 py-2 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2",
              FOCUS
            )}
          >
            {PUBLIC_NAV_CTA.label}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          className={cn(
            "-mr-2 flex h-10 w-10 items-center justify-center rounded-sm text-ink lg:hidden",
            FOCUS
          )}
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-paper px-5 pb-6 pt-3 lg:hidden"
        >
          <div className="flex flex-col">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn("rounded-sm border-b border-line/60 py-3.5 text-[15px] font-medium text-ink", FOCUS)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={PUBLIC_NAV_CTA.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 text-[15px] font-semibold text-paper",
                  FOCUS
                )}
              >
                {PUBLIC_NAV_CTA.label}
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

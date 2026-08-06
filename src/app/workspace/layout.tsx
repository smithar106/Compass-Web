import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAV_CTA } from "@/lib/navigation";
import { Needle } from "@/components/home/primitives";
import { ArrowIcon } from "@/components/home/primitives";
import { AppNav } from "@/components/workspace/AppNav";

export const metadata: Metadata = {
  title: "Workspace — Compass",
  description:
    "Your Compass workspace: decisions across their lifecycle, from recommendation to measured outcome.",
  robots: { index: false, follow: false },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Needle className="h-5 w-5 text-ink" />
            <p className="text-[16px] font-bold tracking-tight text-ink">Workspace</p>
          </div>
          <Link
            href={APP_NAV_CTA.href}
            className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
          >
            {APP_NAV_CTA.label}
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>
      <AppNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}

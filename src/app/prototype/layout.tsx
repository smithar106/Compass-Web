import type { Metadata } from "next";
import Link from "next/link";
import { Needle } from "@/components/home/primitives";

export const metadata: Metadata = {
  title: "Compass Decision Prototype",
  description:
    "Choose an operational problem and see how Compass turns it into an evidence-backed decision: what to do, why it should work, what it will take, and how to measure success.",
  robots: { index: false, follow: false },
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Compass home">
            <Needle className="h-5 w-5 text-ink" />
            <span className="text-[15px] font-bold tracking-tight text-ink">Compass</span>
          </Link>
          <span className="text-[10.5px] font-bold uppercase tracking-eyebrow text-muted">
            Decision Prototype
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-5 py-5 text-[11.5px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Compass Decision Prototype — a demonstration of how Compass evaluates operational problems.</p>
          <Link href="/assessment" className="font-medium text-ink hover:text-muted">
            Analyze my problem →
          </Link>
        </div>
      </footer>
    </div>
  );
}

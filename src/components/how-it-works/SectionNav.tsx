import Link from "next/link";

const LINKS = [
  { label: "Decision Process", href: "#methodology" },
  { label: "Evidence", href: "#evidence" },
  { label: "Methodology", href: "#quality" },
  { label: "Defensibility", href: "#defensibility" },
  { label: "Loop", href: "#loop" },
];

export function SectionNav() {
  return (
    <nav aria-label="On this page" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto py-3">
          {LINKS.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="rounded-sm px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-paper hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

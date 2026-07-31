import Link from "next/link";
import { name, footer } from "@/content/marketing";
import { Needle } from "@/components/home/primitives";

export function Footer() {
  return (
    <footer className="border-t border-lineDark bg-paper-dark text-paper">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Needle className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold tracking-tight">{name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
              {footer.description}
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-paper/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1" aria-hidden="true" />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-lineDark pt-6 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p className="font-mono">
            Decide &middot; Implement &middot; Monitor &middot; Improve
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-semibold">
              {site.name}
            </Link>
            <p className="mt-3 text-sm text-stone leading-relaxed">
              {site.footer.description}
            </p>
          </div>
          {site.footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-cream mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone hover:text-leaf transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-stone/20">
          <p className="text-sm text-stone">{site.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

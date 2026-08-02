import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/home/primitives";
import { Reveal } from "@/components/home/Reveal";

export function Section({
  id,
  number,
  eyebrow,
  headline,
  subtitle,
  children,
  className,
  tone = "light",
}: {
  id?: string;
  number?: string;
  eyebrow: string;
  headline: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <section id={id} className={cn("border-b border-line scroll-mt-24", tone === "light" ? "bg-paper" : "bg-paper-dark", className)}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <Reveal>
          <Eyebrow number={number} tone={tone}>
            {eyebrow}
          </Eyebrow>
          <h2
            className={cn(
              "mt-5 max-w-3xl text-title font-semibold tracking-tight",
              tone === "light" ? "text-ink" : "text-paper"
            )}
          >
            {headline}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "mt-5 max-w-2xl text-lead leading-relaxed",
                tone === "light" ? "text-muted" : "text-paper/70"
              )}
            >
              {subtitle}
            </p>
          )}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

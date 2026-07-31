import { Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  number,
  title,
  subtitle,
}: {
  eyebrow: string;
  number?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-36 sm:px-8 lg:px-10 lg:pb-20 lg:pt-44">
        <Reveal>
          <Eyebrow number={number}>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-title font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lead leading-relaxed text-muted">{subtitle}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

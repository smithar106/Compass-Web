import { site } from "@/content/site";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-heading font-bold text-ink">About Compass</h1>

        <section className="mt-10">
          <h2 className="text-subhead font-semibold text-ink">Our Mission</h2>
          <p className="mt-3 text-body text-stone leading-relaxed">{site.about.mission}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-subhead font-semibold text-ink">Our Vision</h2>
          <p className="mt-3 text-body text-stone leading-relaxed">{site.about.vision}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-subhead font-semibold text-ink">The Problem We Solve</h2>
          <p className="mt-3 text-body text-stone leading-relaxed">{site.about.problem}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-subhead font-semibold text-ink">Our Team</h2>
          <p className="mt-3 text-body text-stone leading-relaxed">{site.about.team}</p>
        </section>
      </div>
    </div>
  );
}

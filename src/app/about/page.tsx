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

        {site.about.futureVision && (
          <section className="mt-16 pt-10 border-t border-border">
            <span className="text-xs font-medium text-forest uppercase tracking-wider">Future vision</span>
            <h2 className="text-subhead font-semibold text-ink mt-2">{site.about.futureVision.headline}</h2>
            <p className="mt-3 text-body text-stone leading-relaxed">{site.about.futureVision.body}</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {site.about.futureVision.items.map((item) => (
                <div key={item.title} className="border border-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="text-xs text-stone mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {site.about.compass && (
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="text-heading font-bold text-ink text-center">{site.about.compass.headline}</h2>
            <p className="mt-2 text-sm text-stone text-center">{site.about.compass.subtitle}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {site.about.compass.directions.map((d) => (
                <div key={d.name} className="text-center p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-mist flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-bold text-forest">{d.name[0]}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink mb-1">{d.label}</h3>
                  <p className="text-xs text-stone leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
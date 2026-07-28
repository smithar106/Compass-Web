import { site } from "@/content/site";

export default function AboutPage() {
  return (
    <div className="bg-[#fbfcfd] min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">

        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-[36px] font-extrabold tracking-[-0.03em] text-[#101826] m-0 mb-4">{site.about.headline}</h1>
          {site.about.body.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-[16px] text-[#4f6280] font-medium leading-relaxed max-w-2xl mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Vision */}
        <div className="bg-white border border-[#dfe5ec] rounded-2xl p-7 mb-10 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green-light flex items-center justify-center text-brand-green-dark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </div>
            <h2 className="text-[18px] font-extrabold text-[#101826] m-0">Our Vision</h2>
          </div>
          <p className="text-[14px] text-[#4f6280] leading-relaxed m-0">{site.about.vision}</p>
        </div>

        {/* Team */}
        <div className="bg-white border border-[#dfe5ec] rounded-2xl p-7 mb-10 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-blue-light flex items-center justify-center text-brand-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="text-[18px] font-extrabold text-[#101826] m-0">Our Team</h2>
          </div>
          <p className="text-[14px] text-[#4f6280] leading-relaxed m-0">{site.about.team}</p>
        </div>

        {/* Principles */}
        {site.about.principles && (
          <div className="bg-white border border-[#dfe5ec] rounded-2xl p-8 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <h2 className="text-[20px] font-extrabold text-[#101826] text-center m-0 mb-2">{site.about.principles.headline}</h2>
            <p className="text-[14px] text-[#5a6b84] text-center mb-8">{site.about.principles.subtitle}</p>
            <div className="grid grid-cols-2 gap-4">
              {site.about.principles.items.map((p, i) => {
                const colors = ["text-brand-green bg-brand-green-light", "text-brand-blue bg-brand-blue-light", "text-brand-purple bg-brand-purple-light", "text-brand-orange bg-brand-orange-light"];
                return (
                  <div key={p.title} className="text-left p-5 border border-[#dfe5ec] rounded-xl">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[i]}`}>
                      <span className="text-[14px] font-extrabold">{p.title[0]}</span>
                    </div>
                    <h3 className="text-[14px] font-extrabold text-[#101826] m-0 mb-1">{p.title}</h3>
                    <p className="text-[13px] text-[#5a6b84] leading-relaxed m-0">{p.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

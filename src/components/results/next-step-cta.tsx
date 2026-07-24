"use client";

interface Props {
  title: string;
}

export function NextStepCTA({ title }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
      <h3 className="text-lg font-semibold text-ink mb-2">Ready to implement {title}?</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
        Generate a detailed implementation blueprint with phased roadmap, timelines, resource requirements, KPIs, and risk mitigation plan.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            const section = document.getElementById("evidence-section");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-6 py-2.5 bg-lime-500 text-white text-sm font-semibold rounded-lg hover:bg-lime-600 transition-colors border border-lime-500"
        >
          Accept Recommendation
        </button>
        <button
          className="px-6 py-2.5 bg-white text-ink text-sm font-semibold rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
        >
          Generate Implementation Blueprint
        </button>
      </div>
    </div>
  );
}

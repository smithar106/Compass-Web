"use client";

import type { ImplementationOption } from "@/types/pipeline";

const defaultOptions: ImplementationOption[] = [
  { label: "Internal Engineering", description: "Build with your existing engineering team" },
  { label: "Existing Automation Team", description: "Leverage your current automation or IT team" },
  { label: "AI Agency / Consultancy", description: "Engage a specialized AI implementation partner" },
  { label: "System Integrator", description: "Work with a systems integration firm" },
  { label: "n8n / Make / Zapier", description: "Low-code automation platforms for rapid deployment" },
  { label: "Major AI Platforms (OpenAI, Anthropic, Google)", description: "Build on leading AI provider platforms" },
];

export function ImplementationOptions({ options }: { options?: ImplementationOption[] }) {
  const items = options?.length ? options : defaultOptions;

  return (
    <div>
      <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">
        Implementation Options
      </h4>
      <p className="text-xs text-stone mb-3">
        Compass is implementation-neutral. Choose the approach that fits your organization.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((opt) => (
          <div key={opt.label} className="border border-border rounded p-2.5 bg-white">
            <div className="text-sm font-medium text-ink">{opt.label}</div>
            <div className="text-xs text-stone mt-0.5">{opt.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

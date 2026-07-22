"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { site } from "@/content/site";

const designPartnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  companySize: z.string().min(1, "Please select a company size"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  linkedinUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
  currentAiInitiatives: z.string().min(10, "Please tell us a bit more about your AI initiatives"),
  biggestChallenge: z.string().min(10, "Please describe your biggest challenge in more detail"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

type DesignPartnerFormValues = z.infer<typeof designPartnerSchema>;

export default function DesignPartnersPage() {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DesignPartnerFormValues>({
    resolver: zodResolver(designPartnerSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      companySize: "",
      role: "",
      linkedinUrl: "",
      currentAiInitiatives: "",
      biggestChallenge: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: DesignPartnerFormValues) => {
    setSubmitState("loading");
    try {
      const res = await fetch("/api/design-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-heading font-bold text-ink">{site.designPartners.headline}</h1>
        <p className="mt-4 text-body text-stone leading-relaxed">{site.designPartners.subtitle}</p>

        <ul className="mt-8 space-y-3">
          {site.designPartners.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-stone">
              <span className="text-forest flex-shrink-0">✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-12 border border-border rounded-lg p-8 bg-white">
          <h2 className="text-subhead font-semibold text-ink">{site.designPartners.form.headline}</h2>

          {submitState === "success" && (
            <div className="mt-6 p-4 bg-mist rounded-lg text-ink text-sm">{site.designPartners.form.success}</div>
          )}

          {submitState === "error" && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg text-red-800 text-sm">{site.designPartners.form.error}</div>
          )}

          {submitState !== "success" && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div className="hidden" aria-hidden="true">
                <input {...register("honeypot")} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                    {site.designPartners.form.fields.name}
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                    {site.designPartners.form.fields.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-ink mb-1.5">
                    {site.designPartners.form.fields.companyName}
                  </label>
                  <input
                    id="companyName"
                    {...register("companyName")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
                </div>

                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-ink mb-1.5">
                    {site.designPartners.form.fields.companySize}
                  </label>
                  <select
                    id="companySize"
                    {...register("companySize")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                  {errors.companySize && <p className="mt-1 text-xs text-red-500">{errors.companySize.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-ink mb-1.5">
                    {site.designPartners.form.fields.role}
                  </label>
                  <input
                    id="role"
                    {...register("role")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                  {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
                </div>

                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-ink mb-1.5">
                    {site.designPartners.form.fields.linkedinUrl}
                  </label>
                  <input
                    id="linkedinUrl"
                    {...register("linkedinUrl")}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                  />
                  {errors.linkedinUrl && <p className="mt-1 text-xs text-red-500">{errors.linkedinUrl.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="currentAiInitiatives" className="block text-sm font-medium text-ink mb-1.5">
                  {site.designPartners.form.fields.currentAiInitiatives}
                </label>
                <textarea
                  id="currentAiInitiatives"
                  rows={3}
                  {...register("currentAiInitiatives")}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-y"
                />
                {errors.currentAiInitiatives && <p className="mt-1 text-xs text-red-500">{errors.currentAiInitiatives.message}</p>}
              </div>

              <div>
                <label htmlFor="biggestChallenge" className="block text-sm font-medium text-ink mb-1.5">
                  {site.designPartners.form.fields.biggestChallenge}
                </label>
                <textarea
                  id="biggestChallenge"
                  rows={3}
                  {...register("biggestChallenge")}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-y"
                />
                {errors.biggestChallenge && <p className="mt-1 text-xs text-red-500">{errors.biggestChallenge.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitState === "loading"}
                className="w-full sm:w-auto px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitState === "loading" ? "Submitting..." : site.designPartners.form.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

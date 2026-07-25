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
    defaultValues: { name: "", email: "", companyName: "", companySize: "", role: "", linkedinUrl: "", currentAiInitiatives: "", biggestChallenge: "", honeypot: "" },
  });

  const onSubmit = async (data: DesignPartnerFormValues) => {
    setSubmitState("loading");
    try {
      const res = await fetch("/api/design-partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
    }
  };

  const inputClass = "w-full px-4 py-3 border border-[#dfe5ec] rounded-xl text-[14px] text-[#101826] bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors";

  return (
    <div className="bg-[#fbfcfd] min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-[36px] font-extrabold tracking-[-0.03em] text-[#101826] m-0 mb-4">{site.designPartners.headline}</h1>
          <p className="text-[18px] text-[#4f6280] font-medium leading-relaxed">{site.designPartners.subtitle}</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {site.designPartners.benefits.map((benefit) => (
            <div key={benefit} className="bg-white border border-[#dfe5ec] rounded-xl p-5 flex items-start gap-3 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
              <div className="w-8 h-8 rounded-lg bg-brand-green-light flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-green-dark"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-[14px] font-semibold text-[#101826] pt-1">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white border border-[#dfe5ec] rounded-2xl p-8 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <h2 className="text-[20px] font-extrabold text-[#101826] m-0 mb-6">{site.designPartners.form.headline}</h2>

          {submitState === "success" && (
            <div className="mb-6 p-4 bg-brand-green-light rounded-xl text-brand-green-dark text-[14px] font-semibold flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              {site.designPartners.form.success}
            </div>
          )}

          {submitState === "error" && (
            <div className="mb-6 p-4 bg-risk-light rounded-xl text-risk text-[14px] font-semibold flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {site.designPartners.form.error}
            </div>
          )}

          {submitState !== "success" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="hidden" aria-hidden="true">
                <input {...register("honeypot")} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.name}</label>
                  <input id="name" {...register("name")} className={inputClass} />
                  {errors.name && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.email}</label>
                  <input id="email" type="email" {...register("email")} className={inputClass} />
                  {errors.email && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.companyName}</label>
                  <input id="companyName" {...register("companyName")} className={inputClass} />
                  {errors.companyName && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.companyName.message}</p>}
                </div>
                <div>
                  <label htmlFor="companySize" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.companySize}</label>
                  <select id="companySize" {...register("companySize")} className={inputClass}>
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                  {errors.companySize && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.companySize.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.role}</label>
                  <input id="role" {...register("role")} className={inputClass} />
                  {errors.role && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.role.message}</p>}
                </div>
                <div>
                  <label htmlFor="linkedinUrl" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.linkedinUrl}</label>
                  <input id="linkedinUrl" {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." className={inputClass} />
                  {errors.linkedinUrl && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.linkedinUrl.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="currentAiInitiatives" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.currentAiInitiatives}</label>
                <textarea id="currentAiInitiatives" rows={3} {...register("currentAiInitiatives")} className={`${inputClass} resize-y`} />
                {errors.currentAiInitiatives && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.currentAiInitiatives.message}</p>}
              </div>

              <div>
                <label htmlFor="biggestChallenge" className="block text-[13px] font-bold text-[#101826] mb-2">{site.designPartners.form.fields.biggestChallenge}</label>
                <textarea id="biggestChallenge" rows={3} {...register("biggestChallenge")} className={`${inputClass} resize-y`} />
                {errors.biggestChallenge && <p className="mt-1.5 text-[12px] text-risk font-semibold">{errors.biggestChallenge.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitState === "loading"}
                className="px-8 py-3 bg-brand-green text-white text-[14px] font-extrabold rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {submitState === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : site.designPartners.form.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

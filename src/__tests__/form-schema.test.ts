import { describe, it, expect } from "vitest";
import { z } from "zod";

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

const validSubmission = {
  name: "Jane Smith",
  email: "jane@example.com",
  companyName: "Acme Corp",
  companySize: "51-200",
  role: "VP of Product",
  linkedinUrl: "https://linkedin.com/in/janesmith",
  currentAiInitiatives: "We are exploring AI for customer support automation and lead scoring.",
  biggestChallenge: "Our sales team spends too much time on manual data entry across disconnected tools.",
};

describe("Design partner form schema", () => {
  it("should accept valid submission", () => {
    const result = designPartnerSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it("should accept valid submission without linkedin URL", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      linkedinUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("should reject missing name", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing company name", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      companyName: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing company size", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      companySize: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject too short role", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      role: "A",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short AI initiatives description", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      currentAiInitiatives: "AI",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short challenge description", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      biggestChallenge: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("should reject submission with honeypot filled", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      honeypot: "I am a bot",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid linkedin URL", () => {
    const result = designPartnerSchema.safeParse({
      ...validSubmission,
      linkedinUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

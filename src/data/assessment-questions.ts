import type { AssessmentQuestion } from "@/types";

export const questions: AssessmentQuestion[] = [
  // Department & Workflow (Starting with business problem)
  { id: "dept-1", section: "General", category: "department", question: "Which department are you assessing?", type: "multi-choice", options: ["Sales", "Marketing", "Customer Success", "Support", "Finance", "Product", "Engineering", "People/HR", "Legal", "Operations"] },
  { id: "dept-2", section: "General", category: "workflow", question: "Describe the specific workflow or process you want to evaluate.", type: "open" },
  { id: "dept-3", section: "General", category: "desired-outcome", question: "What outcome would you like to achieve? (e.g., reduce time, improve accuracy, scale operations)", type: "open" },
  { id: "dept-4", section: "General", category: "pain", question: "What is the biggest pain point or problem in this workflow today?", type: "open" },

  // Frequency & Scale
  { id: "freq-1", section: "Workload", category: "frequency", question: "How frequently does this workflow or task occur?", type: "multi-choice", options: ["Multiple times daily", "Daily", "Weekly", "Monthly", "Quarterly", "Rarely / Ad-hoc"] },
  { id: "freq-2", section: "Workload", category: "people", question: "How many people are currently involved in this workflow?", type: "multi-choice", options: ["1 person", "2-3 people", "4-10 people", "11-50 people", "50+ people"] },
  { id: "freq-3", section: "Workload", category: "handoffs", question: "How many handoffs occur during this process?", type: "multi-choice", options: ["None — one person handles it", "1-2 handoffs", "3-5 handoffs", "6+ handoffs", "Unclear / varies"] },

  // Tools & Data
  { id: "tools-1", section: "Systems", category: "tools", question: "What tools or software do you currently use in this workflow?", type: "open" },
  { id: "tools-2", section: "Systems", category: "data", question: "What data is required for this workflow, and where does it live?", type: "open" },
  { id: "tools-3", section: "Systems", category: "exceptions", question: "How many exceptions or edge cases arise in this process?", type: "multi-choice", options: ["Almost no exceptions", "Some exceptions (<10%)", "Many exceptions (10-30%)", "Highly variable (30%+)"] },

  // Cost & Impact
  { id: "cost-1", section: "Impact", category: "time", question: "How much time does this workflow currently consume per week?", type: "multi-choice", options: ["Less than 1 hour", "1-5 hours", "5-20 hours", "20-40 hours", "More than 40 hours"] },
  { id: "cost-2", section: "Impact", category: "cost", question: "What is the estimated monthly cost or burden of this workflow (people time, errors, delays)?", type: "open" },
  { id: "cost-3", section: "Impact", category: "ownership", question: "Who owns this workflow, and who would need to approve changes?", type: "open" },

  // Risk & Stability
  { id: "risk-1", section: "Risk", category: "risk", question: "What is the risk of getting this workflow wrong?", type: "multi-choice", options: ["Low — minor inconvenience", "Medium — noticeable business impact", "High — significant revenue or compliance risk", "Critical — legal or safety implications"] },
  { id: "risk-2", section: "Risk", category: "stability", question: "How stable is this process? Has it changed significantly in the last year?", type: "multi-choice", options: ["Very stable — unchanged", "Mostly stable — minor tweaks", "Somewhat volatile — changes every few months", "Highly volatile — changes frequently"] },
  { id: "risk-3", section: "Risk", category: "prior-attempts", question: "Have you tried to improve or automate this workflow before? What happened?", type: "open" },

  // Constraints
  { id: "constraints-1", section: "Constraints", category: "technical", question: "Are there any technical constraints that limit your options? (e.g., legacy systems, compliance requirements, data privacy)", type: "open" },
  { id: "constraints-2", section: "Constraints", category: "budget", question: "Do you have a budget or resource constraint for addressing this workflow?", type: "multi-choice", options: ["No dedicated budget", "Under $10K", "$10K - $50K", "$50K - $200K", "$200K+", "Unsure"] },
  { id: "constraints-3", section: "Constraints", category: "timeline", question: "What is your expected timeline for seeing improvement?", type: "multi-choice", options: ["Immediate — within weeks", "Short-term — 1-3 months", "Medium-term — 3-6 months", "Long-term — 6+ months", "No specific timeline"] },
];

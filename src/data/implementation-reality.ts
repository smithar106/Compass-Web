export interface ImplementationStory {
  publication: string;
  headline: string;
  date: string;
  url: string;
  takeaway: string;
}

const STORIES: ImplementationStory[] = [
  {
    publication: "Entrepreneur",
    headline:
      "They Gave an AI Bot a Storefront, 3 Employees and $100,000. Can It Build a Profitable Business?",
    date: "Aug 2025",
    url: "https://www.entrepreneur.com/business-news/an-ai-bot-ran-a-san-francisco-store-for-the-first-time",
    takeaway:
      "Giving AI more autonomy does not automatically create a viable operating model. Execution capability and business value are different things.",
  },
  {
    publication: "RAND Corporation",
    headline:
      "The Root Causes of Failure for Artificial Intelligence Projects and How They Can Succeed",
    date: "Aug 2024",
    url: "https://www.rand.org/pubs/research_reports/RRA2680-1.html",
    takeaway:
      "More than 80% of AI projects fail — not because the technology doesn't work, but because organizations solve the wrong problem, lack the right data, or chase technology instead of business outcomes.",
  },
  {
    publication: "Harvard Business Review",
    headline: "Stop Tinkering with AI",
    date: "Feb 2023",
    url: "https://hbr.org/2023/01/stop-tinkering-with-ai",
    takeaway:
      "AI initiatives at most organizations are too small and too tentative. They never reach the only step that adds economic value — deploying at scale.",
  },
];

export function implementationStories(): ImplementationStory[] {
  return STORIES;
}

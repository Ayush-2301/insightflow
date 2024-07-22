import { StepType } from "@reactour/tour";

export const protectedPaths = ["/watchlist", "/tasks", "/"];

export const steps: StepType[] = [
  {
    selector: ".company-name",
    content:
      "Enter the name of your company. This is how your business will be identified in the system.",
  },
  {
    selector: ".industry",
    content:
      "Specify your industry or introduce your company in one line. This helps in setting the context for your business.",
  },
  {
    selector: ".goal",
    content:
      "Describe the primary services you offer or your main business goal in one line. This information is used to generate relevant recommendations.",
  },
  {
    selector: ".website_url",
    content: "Provide the URL of your company's website.",
  },
  {
    selector: ".competion_url",
    content:
      "Enter the URLs of your competitors. This data helps the recommendation engine to provide competitive insights.",
  },
  {
    selector: ".social-media",
    content:
      "Include links to your social media profiles (e.g., Facebook, Twitter, YouTube).",
  },
  {
    selector: ".description",
    content:
      "Write a brief description of your company (optional, up to 100 words). This helps in giving a concise overview of your business.",
  },
];

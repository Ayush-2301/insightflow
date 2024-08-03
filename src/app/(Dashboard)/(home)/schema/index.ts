import { z } from "zod";

const social_media_url = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
});

export const companyFormSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1, "Please enter a company name"),
  description: z.string().max(500, "Word limit is 500 characters").optional(),
  website_url: z.string().url(),
  industry: z.string().min(1, "Please enter your industry type"),
  goal: z.string().min(1, "Please select a goal"),
  competion_urls: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url(),
      })
    )
    .min(1, "Please enter atleast one competion URL"),
  social_media_url: social_media_url.optional(),
  created_at: z.date().default(new Date()),
});

export type CompanyForm = z.infer<typeof companyFormSchema>;

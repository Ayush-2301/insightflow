import { z } from "zod";

export const keywords = z.object({
  id: z.string(),
  keyword: z.string().min(1, "Please enter the name of the keyword"),
  volume: z.string(),
  approve: z.boolean(),
});

export const watchlistFormSchema = z.object({
  title: z.string().min(1, "Please enter a watchlist title"),
  user_id: z.string(),
  createdAt: z.date(),
  keywords: z.array(keywords).min(1, "Atleast one keyword must be specified"),
});
export type WatchlistForm = z.infer<typeof watchlistFormSchema>;

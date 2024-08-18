import { z } from "zod";

export const accessTokenSchema = z.object({
  access_token: z.string().min(1, "Please enter your access token"),
  boardTitle: z.string().optional(),
});
export type AccessTokenForm = z.infer<typeof accessTokenSchema>;

export const updateTrello = z.object({
  accesstoken: z.string().min(1, "Please enter your access token"),
  boardTitle: z.string(),
});
export type UpdateTrelloForm = z.infer<typeof updateTrello>;

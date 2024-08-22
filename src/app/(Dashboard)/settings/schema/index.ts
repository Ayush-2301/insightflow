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

export const profileSchema = z.object({
  username: z.string().min(1, "Please enter yout username"),
});

export type ProfileForm = z.infer<typeof profileSchema>;

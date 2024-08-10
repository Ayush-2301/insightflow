import { z } from "zod";

export const accessTokenSchema = z.object({
  access_token: z.string().min(1, "Please enter your access token"),
});
export type AccessTokenForm = z.infer<typeof accessTokenSchema>;

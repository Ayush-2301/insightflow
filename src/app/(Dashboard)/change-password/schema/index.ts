import { z } from "zod";

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(1, "Please enter your new password"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

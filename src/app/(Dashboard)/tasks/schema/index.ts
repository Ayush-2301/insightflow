import { z } from "zod";

export const taskFormSchema = z.object({
  user_id: z.string(),
  title: z.string().min(1, "Please enter a task title"),
  description: z.string(),
  deadline: z.date(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  assigned_to: z.string(),
  approved: z.boolean().default(false),
  created_at: z.date().default(new Date()),
});

export type TaskForm = z.infer<typeof taskFormSchema>;

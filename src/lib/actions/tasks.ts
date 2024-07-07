"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { type Task } from "../types";

import { revalidatePath } from "next/cache";
import { TaskForm } from "@/app/(Dashboard)/tasks/schema";
const SERVER_URL = process.env.SERVER_URL;

export const getAllTasks = async () => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();

    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/tasks`, {
      method: "GET",
      headers: {
        Authorization: session,
      },
    });
    const tasks: Task[] = await response.json();
    return tasks;
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
};

export const getSingleTask = async ({ id }: { id: string }) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();

    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/tasks/?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: session,
      },
    });
    const task: Task[] = await response.json();

    return task[0];
  } catch (error) {
    throw new Error("Error fetching task");
  }
};

export const updateTask = async ({
  newTask,
  taskID,
}: {
  newTask: TaskForm;
  taskID: string;
}) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const taskData = { task_id: taskID, ...newTask };

    const response = await fetch(`${SERVER_URL}/tasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
      },
      body: JSON.stringify([taskData]),
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidatePath("/");
      const res: Task[] = await response.json();
      return res[0];
    }
  } catch {
    throw new Error("Error updating task");
  }
};

export const insertTask = async ({ newTask }: { newTask: TaskForm }) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
      },
      body: JSON.stringify([newTask]),
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidatePath("/tasks");
      const res: Task[] = await response.json();
      return res[0];
    }
  } catch {
    throw new Error("Error inserting task");
  }
};

export const deleteTask = async ({ id }: { id: string }) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/tasks/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: session,
      },
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidatePath("/");
      const res: Task[] = await response.json();
      return res[0];
    }
  } catch (error) {
    throw new Error("Error deleting the task");
  }
};

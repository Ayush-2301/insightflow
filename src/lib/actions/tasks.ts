"use server";

import { redirect } from "next/navigation";
import { type Task } from "../types";

import { revalidateTag } from "next/cache";
import { TaskForm } from "@/app/(Dashboard)/tasks/schema";
import { getSession } from "./index";
import { createSupabaseServerClient } from "../supabase/server";
const SERVER_URL = process.env.SERVER_URL;

export const getAllTasks = async () => {
  try {
    const { access_token, user_id } = await getSession();

    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/tasks/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        Authorization: access_token,
      },
      next: {
        revalidate: 3600,
        tags: ["tasks"],
      },
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      const tasks: Task[] = await response.json();
      return tasks;
    }
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
};

export const getSingleTask = async ({ id }: { id: string }) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/tasks/?task_id=${id}`, {
      method: "GET",
      headers: {
        Authorization: access_token,
      },
      next: {
        revalidate: 3600,
        tags: ["tasks"],
      },
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      const task: Task[] = await response.json();
      return task[0];
    }
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
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const taskData = { task_id: taskID, ...newTask };

    const response = await fetch(`${SERVER_URL}/tasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: JSON.stringify([taskData]),
    });
    if (response.ok) {
      revalidateTag("tasks");
      const res: Task[] = await response.json();
      return res[0];
    }
  } catch {
    throw new Error("Error updating task");
  }
};

export const insertTask = async ({ newTask }: { newTask: TaskForm }) => {
  try {
    const { access_token } = await getSession();

    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: JSON.stringify([newTask]),
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidateTag("tasks");
      const res: Task[] = await response.json();
      return res[0];
    }
  } catch {
    throw new Error("Error inserting task");
  }
};

export const deleteTask = async ({ id }: { id: string }) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/tasks/?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: access_token,
      },
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidateTag("tasks");
      const res: Task[] = await response.json();
      return res[0];
    }
  } catch (error) {
    throw new Error("Error deleting the task");
  }
};

export const getAllTaskByWatchlistID = async ({
  watchlistID,
}: {
  watchlistID: string;
}) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/tasks/?watchlist_id=${watchlistID}`,
      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
        next: {
          revalidate: 3600,
          tags: ["tasks"],
        },
      }
    );
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      const tasks: Task[] = await response.json();
      return tasks;
    }
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
};

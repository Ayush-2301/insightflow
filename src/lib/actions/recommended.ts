"use server";

import { redirect } from "next/navigation";
import { getSession } from ".";
import { RecommendedTask } from "../types";
import { createSupabaseServerClient } from "../supabase/server";
import { revalidateTag } from "next/cache";

const SERVER_URL = process.env.SERVER_URL;

export const getRecommendedTask = async ({
  id,
  page,
  pagesize,
}: {
  id: string;
  page: string;
  pagesize: string;
}) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/recommendationTasks/?watchlist_id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
      }
    );

    if (response.ok) {
      const res: {
        paginatedResult: RecommendedTask[];
        totalCount: string;
      } = await response.json();

      return res;
    }
  } catch (error) {
    throw new Error("Error fetching recommendations");
  }
};

export const updateRecommendedTask = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/recommendationTasks/?task_id=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
    const res: RecommendedTask[] = await response.json();
    revalidateTag("tasks");
    return res[0];
  } catch (error) {
    throw new Error("Error updating recommendation status");
  }
};

"use server";

import { redirect } from "next/navigation";
import { getSession } from ".";
import { RecommendedTask } from "../types";

const SERVER_URL = process.env.SERVER_URL;

export const getRecommendedTask = async ({ id }: { id: string }) => {
  try {
    const { access_token } = await getSession();
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
      const res: RecommendedTask[] = await response.json();
      return res;
    }
  } catch (error) {
    throw new Error("Error fetching recommendations");
  }
};

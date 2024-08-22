"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { Goal, Keyword, Masterkeywords } from "../types";
import { cache } from "react";

const SERVER_URL = process.env.SERVER_URL;
export const readUser = cache(async () => {
  const supabase = createSupabaseServerClient();
  return await supabase.auth.getUser();
});

export const getSession = async () => {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  const access_token = data.session?.access_token;
  const user_id = data.session?.user.id;
  return { access_token, user_id };
};

export async function searchKeyword({
  searchString,
}: {
  searchString: string;
}) {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/search_keywords?search_string=${searchString}`,
      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
        next: {
          revalidate: 3600,
          tags: ["search_keywords"],
        },
      }
    );
    const res: Keyword[] = await response.json();
    return res;
  } catch (error) {
    return [];
  }
}

export const getGoals = async () => {
  const { access_token } = await getSession();
  if (!access_token) redirect("/auth");
  const response = await fetch(`${SERVER_URL}/goals`, {
    method: "GET",
    headers: {
      Authorization: access_token,
    },
    next: {
      revalidate: 3600,
      tags: ["goals"],
    },
  });
  const goals: Goal[] = await response.json();
  return goals;
};

export const getMasterKeywords = async () => {
  try {
    const { access_token, user_id } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/masterkeywords?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
        cache: "no-cache",
      }
    );
    if (response.ok) {
      const res: Masterkeywords[] = await response.json();
      console.log("masterkeywords", res);

      return res;
    }
  } catch (error) {
    console.log("error", error);
  }
};

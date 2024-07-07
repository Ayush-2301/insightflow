"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { Keyword } from "../types";

const SERVER_URL = process.env.SERVER_URL;
export default async function readUser() {
  const supabase = createSupabaseServerClient();
  return await supabase.auth.getUser();
}

export async function searchKeyword({
  searchString,
}: {
  searchString: string;
}) {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(
      `${SERVER_URL}/search_keywords?search_string=${searchString.toLowerCase()}`,
      {
        headers: {
          Authorization: session,
        },
      }
    );
    const res: Keyword[] = await response.json();
    return res;
  } catch (error) {
    return [];
  }
}

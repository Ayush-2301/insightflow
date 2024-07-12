"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { Keyword } from "../types";
import { cookies } from "next/headers";
import { Session } from "@supabase/supabase-js";
import { Buffer } from "buffer";

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
    const { access_token } = await getSession();
    const response = await fetch(
      `${SERVER_URL}/search_keywords?search_string=${searchString.toLowerCase()}`,
      {
        headers: {
          Authorization: access_token,
        },
        next: {
          revalidate: 1000,
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

export const getSession = async () => {
  const base64Data = cookies()
    .get(`sb-${process.env.SUPABASE_DB_ID}-auth-token`)
    ?.value.replace(/^base64-/, "");
  const session: Session =
    base64Data &&
    (await JSON.parse(Buffer.from(base64Data, "base64").toString("ascii")));
  const access_token = session.access_token;
  const user = session.user;
  return { access_token, user };
};

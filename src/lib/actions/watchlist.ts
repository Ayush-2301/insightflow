"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import { WatchlistForm } from "@/app/(Dashboard)/watchlist/schema";
import { insertWatchlist, Watchlist, WatchlistReturned } from "../types";

// const SERVER_URL = "http://localhost:5555";
const SERVER_URL = process.env.SERVER_URL;

export const getAllWatchlist = async () => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(
      `${SERVER_URL}/watchlist/?user_id=${data.session?.user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: session,
        },
      }
    );

    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      const res: WatchlistReturned[] = await response.json();
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getWatchlist = async ({ id }: { id: string }) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/watchlist/?id=${id}`);

    const res: WatchlistReturned[] = await response.json();
    const result: Watchlist = {
      id: res[0].watchlist.id,
      user_id: res[0].watchlist.user_id,
      title: res[0].watchlist.title,
      createdAt: res[0].watchlist.createdAt,
      keywords: res[0].keywords,
      tasks: res[0].tasks,
    };
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const createWatchlist = async ({
  newWatchList,
}: {
  newWatchList: WatchlistForm;
}) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const newData: insertWatchlist = {
      watchlist: {
        user_id: newWatchList.user_id,
        title: newWatchList.title,
        createdAt: newWatchList.createdAt,
      },
      keywords: newWatchList.keywords,
    };
    const response = await fetch(`${SERVER_URL}/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else return await response.json();
  } catch (error) {}
};

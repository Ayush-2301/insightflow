"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { WatchlistForm } from "@/app/(Dashboard)/watchlist/schema";
import {
  insertWatchlist,
  Keyword,
  Watchlist,
  WatchlistReturned,
} from "../types";
import { getSession } from "./index";
import { createSupabaseServerClient } from "../supabase/server";
const SERVER_URL = process.env.SERVER_URL;

export const getAllWatchlist = async () => {
  try {
    const { access_token, user_id } = await getSession();

    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/watchlist/?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
        next: {
          revalidate: 3600,
          tags: ["watchlist"],
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
    throw new Error("Error fetching watchlist");
  }
};

export const getWatchlist = async ({ id }: { id: string }) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/watchlist/?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: access_token,
      },
      next: {
        revalidate: 3600,
        tags: ["watchlist"],
      },
    });

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
    throw new Error("Error fetching watchlist");
  }
};

export const createWatchlist = async ({
  newWatchList,
}: {
  newWatchList: WatchlistForm;
}) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
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
        Authorization: access_token,
      },
      body: JSON.stringify(newData),
    });
    console.log(newData);
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidateTag("watchlist");
      const res: {
        watchlist: {
          id: string;
          title: string;
          user_id: string;
          created_at: Date;
        };
        keywords: {
          keyword: string;
          keyword_id: string;
          watchlist_id: string;
        }[];
      }[] = await response.json();

      return res[0];
    }
  } catch (error) {
    throw new Error("Error creating task");
  }
};

export const deleteWatchlist = async ({ id }: { id: string }) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/watchlist/?id=${id}`, {
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
      revalidateTag("watchlist");
      revalidateTag("tasks");

      return await response.json();
    }
  } catch (error) {
    throw new Error("Error deleting company");
  }
};

export const updateWatchlist = async ({
  newWatchList,
  id,
}: {
  newWatchList: WatchlistForm;
  id: string;
}) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const newData = {
      watchlist_id: id,
      ...newWatchList,
    };
    const response = await fetch(`${SERVER_URL}/watchlist`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      const res = await response.json();
      revalidateTag("watchlist");
      return res;
    }
  } catch (error) {
    throw new Error("Error updating watchlist");
  }
};

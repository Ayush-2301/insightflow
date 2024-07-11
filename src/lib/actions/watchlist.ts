"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { WatchlistForm } from "@/app/(Dashboard)/watchlist/schema";
import { insertWatchlist, Watchlist, WatchlistReturned } from "../types";
import { getSession } from "./index";
const SERVER_URL = process.env.SERVER_URL;

export const getAllWatchlist = async () => {
  try {
    const { access_token, user } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/watchlist/?user_id=${user.id}`,
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
    const { access_token, user } = await getSession();
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
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    } else {
      revalidateTag("watchlist");
      return await response.json();
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
      console.log(error);
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

// export const updateWatchlist = async({ newWatchlist, id }: {
//   newWatchlist: WatchlistForm;
//   id: string;
// }) => {
//   try {
//      const supabase = createSupabaseServerClient();
//      const { data } = await supabase.auth.getSession();
//      const session = data.session?.access_token;
//      if (!session) {
//        redirect("/auth");
//      }
//     const newData = updateWatchlist = {

//     }
//   } catch (error) {

//   }
// }

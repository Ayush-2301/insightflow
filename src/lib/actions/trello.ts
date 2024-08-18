"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { Trello } from "../types";
import { AccessTokenForm } from "@/app/(Dashboard)/settings/schema";
import { revalidateTag } from "next/cache";
import { getSession } from ".";

const SERVER_URL = process.env.SERVER_URL;

export const getTrelloInfo = async () => {
  try {
    const { access_token, user_id } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/getTrello/?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
        next: {
          revalidate: 3600,
          tags: ["trello"],
        },
      }
    );
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
    const trello_info: Trello[] = await response.json();
    return trello_info[0];
  } catch (error) {
    console.log(error);
  }
};

export const createTrelloInfo = async ({
  value,
}: {
  value: AccessTokenForm;
}) => {
  try {
    const { access_token, user_id } = await getSession();

    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/createboard?user_id=${user_id}`,
      {
        method: "POST",
        headers: {
          Authorization: access_token,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(value),
      }
    );
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
    revalidateTag("trello");
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const addTaskToTrello = async ({
  name,
  desc,
  taskid,
  access_token,
  list_id,
}: {
  name: string;
  desc: string;
  access_token: string;
  list_id: string;
  taskid: string;
}) => {
  try {
    const { access_token: accessToken } = await getSession();
    if (!accessToken) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/createCard`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({
        name,
        desc,
        taskid,
        list_id,
        access_token,
      }),
    });
    if (response.ok) {
      revalidateTag("tasks");
      return await response.json();
    } else {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
  } catch (error) {
    console.log(error);
  }
};

export const disconnectTaskFromTrello = async ({
  taskID,
}: {
  taskID: string;
}) => {
  try {
    const { access_token: accessToken } = await getSession();
    if (!accessToken) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/disconnect/?task_id=${taskID}`,
      {
        method: "PUT",
        headers: {
          Authorization: accessToken,
        },
      }
    );
    if (response.ok) {
      revalidateTag("tasks");
      return await response.json();
    } else {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTrelloConfig = async ({
  accesstoken,
  boardId,
  boardTitle,
  previousAccesstoken,
}: {
  accesstoken: string;
  boardId: string;
  boardTitle: string;
  previousAccesstoken: string;
}) => {
  try {
    const { access_token, user_id } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `https://app.pludous.com/updateTrelloConfig/?user_id=${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: previousAccesstoken,
        },
        body: JSON.stringify({
          accesstoken,
          boardId,
          boardTitle,
          previousAccesstoken,
        }),
      }
    );
    if (!response.ok) {
      return { message: "error" };
    }
    revalidateTag("trello");
    const res = await response.json();
    console.log(res);
    return { message: "Success" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteTrelloConfig = async ({
  previousAccesstoken,
  boardId,
}: {
  previousAccesstoken: string;
  boardId: string;
}) => {
  try {
    console.log("called");
    const { access_token, user_id } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(
      `${SERVER_URL}/deleteTrelloConfig?user_id=${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({
          boardId,
          previousAccesstoken,
        }),
      }
    );
    if (!response.ok) {
      const res = await response.json();
      console.log(res);
      return { message: "error" };
    }
    revalidateTag("trello");
    revalidateTag("tasks");
    const res = await response.json();
    console.log(res);
    return { message: "Success" };
  } catch (error) {}
};

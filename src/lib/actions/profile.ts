"use server";
import { redirect } from "next/navigation";
import { Profile } from "../types";
import { revalidateTag } from "next/cache";
import { getSession } from "./index";

const SERVER_URL = process.env.SERVER_URL;

export const getProfile = async () => {
  try {
    const { access_token, user_id } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/user/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        Authorization: access_token,
      },
      next: {
        revalidate: 3600,
        tags: ["profile"],
      },
    });
    if (!response.ok) {
      const error: { error: string } = await response.json();
      return error;
    }
    const profile: Profile[] = await response.json();
    return profile[0];
  } catch (error) {
    throw new Error("Error fetching profile");
  }
};

export const updateProfile = async ({ username }: { username: string }) => {
  try {
    const { access_token, user_id } = await getSession();
    if (!access_token) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/user/?user_id=${user_id}`, {
      method: "PUT",
      headers: {
        Authorization: access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      const error: { error: string } = await response.json();
      return error;
    }
    revalidateTag("profile");
    const profile: Profile[] = await response.json();
    return profile[0];
  } catch (error) {
    throw new Error("Error updating profile");
  }
};

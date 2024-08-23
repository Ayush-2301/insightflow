"use server";

import { redirect } from "next/navigation";
import { type Company } from "../types";
import { CompanyForm } from "@/app/(Dashboard)/(home)/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "./index";

const SERVER_URL = process.env.SERVER_URL;

export const getCompany = async () => {
  try {
    const { access_token, user_id } = await getSession();
    if (!access_token) redirect("/auth");
    console.log(user_id);
    const response = await fetch(
      `${SERVER_URL}/company_info/?user_id=${user_id}`,

      {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
        next: {
          revalidate: 3600,
          tags: ["company_info"],
        },
      }
    );

    if (!response.ok) {
      const res: {
        error?: string;
        message?: string;
      } = await response.json();
      return res;
    }
    const res: Company = await response.json();

    return res;
  } catch (error) {
    throw new Error("Error fetching company info");
  }
};

export const createCompany = async ({
  newCompany,
}: {
  newCompany: CompanyForm;
}) => {
  try {
    const { access_token } = await getSession();
    if (!access_token) redirect("/auth");
    const response = await fetch(`${SERVER_URL}/company_info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: JSON.stringify(newCompany),
    });

    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
    const res: Company = await response.json();
    revalidateTag("masterkeywords");
    revalidateTag("company_info");

    return res;
  } catch (error) {
    throw new Error("Error Creating Company ");
  }
};

export const updateCompany = async ({
  newCompany,
  id,
}: {
  newCompany: CompanyForm;
  id: string;
}) => {
  try {
    const { access_token } = await getSession();

    if (!access_token) redirect("/auth");
    const formData = { id, ...newCompany };

    const response = await fetch(`${SERVER_URL}/company_info`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      const error: {
        error: string;
      } = await response.json();
      return error;
    }
    const res: Company = await response.json();
    revalidateTag("masterkeywords");
    revalidateTag("company_info");

    return res;
  } catch (error) {
    throw new Error("Error Creating Company");
  }
};

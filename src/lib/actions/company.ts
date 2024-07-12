"use server";

import { redirect } from "next/navigation";
import { type Company } from "../types";
import { CompanyForm } from "@/app/(Dashboard)/(home)/schema";
import { revalidateTag } from "next/cache";
import { getSession } from "./index";
import { createSupabaseServerClient } from "../supabase/server";
import { cookies } from "next/headers";
const SERVER_URL = process.env.SERVER_URL;

export const getCompany = async () => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;

    if (!access_token) redirect("/auth");
    // const x = await getSession();
    // console.log(x.access_token);
    // console.log(cookies().getAll());
    const response = await fetch(
      `${SERVER_URL}/company_info/?user_id=${data.session?.user.id}`,

      {
        method: "GET",
        headers: {
          Authorization: access_token,
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
    console.log(error);
    throw new Error("Error fetching company info");
  }
};

export const createCompany = async ({
  newCompany,
}: {
  newCompany: CompanyForm;
}) => {
  try {
    // const { access_token } = await getSession();
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;
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
    // const { access_token } = await getSession();
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;
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
    revalidateTag("company_info");
    return res;
  } catch (error) {
    throw new Error("Error Creating Company");
  }
};

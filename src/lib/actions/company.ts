"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";
import { type Company } from "../types";
import { CompanyForm } from "@/app/(Dashboard)/(home)/schema";
import { revalidatePath } from "next/cache";
const SERVER_URL = process.env.SERVER_URL;

export const getCompany = async () => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(
      `${SERVER_URL}/company_info/?user_id=${data.session?.user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: session,
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
  }
};

export const createCompany = async ({
  newCompany,
}: {
  newCompany: CompanyForm;
}) => {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/company_info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
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
    revalidatePath("/");
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
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session?.access_token;
    const formData = { id, ...newCompany };
    if (!session) {
      redirect("/auth");
    }
    const response = await fetch(`${SERVER_URL}/company_info`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
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
    revalidatePath("/");
    return res;
  } catch (error) {
    throw new Error("Error Creating Company");
  }
};

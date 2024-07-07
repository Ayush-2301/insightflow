"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signUpWithEmailAndPassword(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const supabase = createSupabaseServerClient();
  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.username,
      },
    },
  });
  revalidatePath("/", "layout");
  return JSON.stringify(result);
}

export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  revalidatePath("/", "layout");
  return JSON.stringify(result);
}

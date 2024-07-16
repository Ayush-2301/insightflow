import React from "react";
import { AuthForm } from "./components/AuthForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function page() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <AuthForm />
      </div>
    </div>
  );
}

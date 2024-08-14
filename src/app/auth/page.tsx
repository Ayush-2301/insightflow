import React, { Suspense } from "react";
import { AuthForm } from "./components/AuthForm";
import { redirect } from "next/navigation";
import { readUser } from "@/lib/actions";
import { Spinner } from "@/components/Spinner";

export default async function page() {
  const { data } = await readUser();
  if (data.user) redirect("/");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <Suspense fallback={<Spinner size={"default"} />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}

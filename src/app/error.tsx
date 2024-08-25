"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const router = useRouter();
  return (
    <div className=" h-screen flex justify-center items-center">
      <div className=" bg-white shadow p-6 flex flex-col rounded-md">
        <h2>Something went wrong!</h2>
        <Button
          className="self-end"
          variant="outline"
          onClick={() => router.push("/")}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

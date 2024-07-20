"use client";
import React, { useContext, useEffect, useState } from "react";
import { RecommendedTask } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { WatchlistsSkeleton } from "./Watchlists";
import { getRecommendedTask } from "@/lib/actions/recommended";

import dynamic from "next/dynamic";
import { RecommendedTaskContext } from "@/components/provider/RecommendedTaskProvider";

const RecommendationTaskTable = dynamic(
  () => import("./RecommendationTaskTable"),
  { ssr: false }
);

const Recommendedtask = ({ id }: { id: string }) => {
  const { recommendedTask, setRecommendedTask } = useContext(
    RecommendedTaskContext
  );
  console.log(recommendedTask);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();
  useEffect(() => {
    async function getTasks() {
      setLoading(true);
      const tasks = await getRecommendedTask({
        id: id,
        page: "1",
        pagesize: "10",
      });
      if (tasks?.paginatedResult && tasks?.paginatedResult.length >= 1) {
        setRecommendedTask(tasks.paginatedResult);
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
    getTasks();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("recommendedTask")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "recommended_tasks",
        },
        (payload) => {
          setLoading(false);
          const newTask = payload.new as RecommendedTask;
          setRecommendedTask((prev) => (prev ? [newTask, ...prev] : [newTask]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  // const highlightText = (text: string, highlight: string) => {
  //   if (!highlight.trim()) {
  //     return text;
  //   }
  //   const regex = new RegExp(`(${highlight})`, "gi");
  //   return text.split(regex).map((part, index) =>
  //     regex.test(part) ? (
  //       <span key={index} className="bg-purple-300">
  //         {part}
  //       </span>
  //     ) : (
  //       part
  //     )
  //   );
  // };

  // if ("error" in recommendedTask) {
  //   return <div className="text-red-500">Error: {recommendedTask.error}</div>;
  // }

  return (
    <div className="flex flex-col gap-4 ">
      <div className="h-full flex flex-col gap-2">
        {loading ? (
          <WatchlistsSkeleton />
        ) : (
          <div>
            <RecommendationTaskTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendedtask;

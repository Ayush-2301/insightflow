"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { RecommendedTask } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WatchlistsSkeleton } from "./Watchlists";
import {
  getRecommendedTask,
  updateRecommendedTask,
} from "@/lib/actions/recommended";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import RecommendationTaskTable from "./RecommendationTaskTable";
import dynamic from "next/dynamic";
import { DataTable } from "@/components/recommendedTask/data-table";
import { columns } from "@/components/recommendedTask/columns";
import { Context } from "@/components/provider/ContextProvider";

const RecommendationTaskTable = dynamic(
  () => import("./RecommendationTaskTable"),
  { ssr: false }
);

const ITEMS_PER_PAGE = 5;

const Recommendedtask = ({ id }: { id: string }) => {
  // const { setRecommendedTask, recommendedTask } = useContext(Context);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [recommendedTask, setRecommendedTask] = useState<RecommendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  // const [approveTaskLoading, setApproveTaskLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  //   setCurrentPage(1);
  // };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };
  // const handleSortChange = (value: "asc" | "desc") => {
  //   setSortOrder(value);
  // };

  // const filteredTasks = Array.isArray(recommendedTask)
  //   ? recommendedTask.filter((task) =>
  //       task.task.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   : [];

  // const paginatedTasks = filteredTasks.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  // const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  // const approveTask = async (id: string) => {
  //   setApproveTaskLoading(true);
  //   const status = true;
  //   const res = await updateRecommendedTask({ id, status });
  //   if ("error" in res) {
  //     toast({
  //       title: "Error approving task",
  //       description: res.error,
  //       variant: "destructive",
  //     });
  //   } else {
  //     toast({
  //       title: "Task approved successfully",
  //     });

  //     router.refresh();
  //     setRecommendedTask((prev) =>
  //       prev ? prev.filter((task) => task.task_id !== id) : []
  //     );
  //   }
  //   setApproveTaskLoading(false);
  // };

  // const rejectTask = async (id: string) => {
  //   setApproveTaskLoading(true);
  //   const status = false;
  //   const res = await updateRecommendedTask({ id, status });
  //   if ("error" in res) {
  //     toast({
  //       title: "Error rejecting task",
  //       description: res.error,
  //       variant: "destructive",
  //     });
  //   } else {
  //     toast({ title: "Task rejected successfully" });
  //     router.refresh();
  //     setRecommendedTask((prev) =>
  //       prev ? prev.filter((task) => task.task_id !== id) : []
  //     );
  //   }
  //   setApproveTaskLoading(false);
  // };
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
  // useEffect(() => {
  //   const sortedTasks = [...recommendedTask].sort((a, b) =>
  //     sortOrder === "asc" ? a.clarity - b.clarity : b.clarity - a.clarity
  //   );
  //   setRecommendedTask(sortedTasks);
  // }, [sortOrder]);

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
      {/* <div className="flex gap-2 items-center ">
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Recommended Tasks"
        />
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by clarity</SelectLabel>

              <SelectItem value="dsc" className="cursor-pointer">
                Highest to Lowest Clarity
              </SelectItem>
              <SelectItem value="asc" className="cursor-pointer">
                Lowest to Highest Clarity
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Search</Button>
      </div> */}
      <div className="h-full flex flex-col gap-2">
        {loading ? (
          <WatchlistsSkeleton />
        ) : (
          // paginatedTasks.length > 0 &&
          // paginatedTasks.map((task) => (
          //   <div
          //     key={task.task_id}
          //     className="group/pending p-4 border rounded-lg flex justify-between items-center shadow min-h-[100px]"
          //   >
          //     <div>
          //       <p className="text-gray-600">
          //         {highlightText(task.task, searchTerm)}
          //       </p>
          //       <p className="text-sm text-gray-400">
          //         Created at: {new Date().toDateString()}
          //       </p>
          //     </div>
          //     <div className="flex space-x-2">
          //       <Button
          //         variant={"outline"}
          //         className="p-2 invisible group-hover/pending:visible"
          //         onClick={() => approveTask(task.task_id)}
          //       >
          //         {approveTaskLoading ? (
          //           <Spinner />
          //         ) : (
          //           <Check className="w-4 h-4" />
          //         )}
          //       </Button>
          //       <Button
          //         className="p-2 invisible group-hover/pending:visible"
          //         variant="outline"
          //         onClick={() => rejectTask(task.task_id)}
          //       >
          //         {approveTaskLoading ? <Spinner /> : <X className="w-4 h-4" />}
          //       </Button>
          //     </div>
          //   </div>
          // ))
          <div>
            <RecommendationTaskTable recommendedTask={recommendedTask} />
            {/* <DataTable columns={columns} data={recommendedTask} /> */}
          </div>
        )}
      </div>
      {/* <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index + 1 === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  );
};

export default Recommendedtask;

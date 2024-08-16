"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, LucideEdit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { StaticTasks, Watchlist } from "@/lib/types";
import { AlertModal } from "@/components/modal/alert-modal";
import { deleteWatchlist } from "@/lib/actions/watchlist";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStaticTask } from "@/lib/actions/recommended";
import RecommendedTaskProvider from "@/components/provider/RecommendedTaskProvider";
import Recommendedtask from "./Recommendedtask";
import { WatchlistsSkeleton } from "../page";
const WatchlistItem = ({ data }: { data: Watchlist }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staticTask, setStaticTask] = useState<StaticTasks[] | undefined>();

  function editWatchlist() {
    router.push(`watchlist/${data.id}`);
  }
  const MAX_KEYWORDS = 5;
  async function handleDelete() {
    const id = data.id;
    setIsLoading(true);
    const res = await deleteWatchlist({ id });
    setIsLoading(false);
    if ("error" in res) {
      toast({
        title: "Error deleting watchlist",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Watchlist deleted successfully",
      });
      router.push("/watchlist");
    }
  }
  async function handleRecommendedTaskExpanded() {
    setShow(!show);
  }
  useEffect(() => {
    async function getStaticTasks() {
      setIsLoading(true);
      const id = data.id;
      const task = await getStaticTask({ id });

      setStaticTask(task?.paginatedResult);
      setIsLoading(false);
    }
    if (show) {
      getStaticTasks();
    }
  }, [show]);
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />
      <div className="group/watchlistItem flex flex-col space-y-2 justify-center px-6 py-4 border rounded-md hover:shadow-md transition-all ease-in-out">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{data.title}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant={"ghost"}>
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-[30px]" align="center">
              <DropdownMenuItem className="group/edit cursor-pointer">
                <div
                  onClick={editWatchlist}
                  className=" group-hover/edit:text-[#0079f] cursor-pointer gap-2 flex justify-start items-center w-full"
                >
                  <LucideEdit className="w-4 h-4" />
                  Edit
                </div>
              </DropdownMenuItem>

              {data && (
                <DropdownMenuItem className="group/delete cursor-pointer">
                  <div
                    onClick={() => setOpen(true)}
                    className=" group-hover/delete:text-red-500 flex justify-start items-center gap-2 w-full "
                  >
                    <Trash className="w-4 h-4" /> Delete
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.keywords
            .slice(0, isExpanded ? data.keywords.length : MAX_KEYWORDS)
            .map((item) => (
              <span
                key={item.id}
                className={`px-2 py-1 rounded-full mr-2 mb-2 shadow flex items-center capitalize ${
                  item.approve === false
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.keyword}
              </span>
            ))}
        </div>
        {data.keywords.length > MAX_KEYWORDS && (
          <Button
            className="items-start justify-start underline"
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "View Less" : "View More"}
          </Button>
        )}
        <Button
          variant={"ghost"}
          className="underline self-start text-start px-1"
          onClick={() => handleRecommendedTaskExpanded()}
        >
          {!show ? "Show Recommended Task" : "Close"}
        </Button>
        {show ? (
          isLoading ? (
            <WatchlistsSkeleton />
          ) : (
            <div className="w-full mt-8">
              <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
              <div className="space-y-4 mb-4">
                <RecommendedTaskProvider>
                  <Recommendedtask staticTasks={staticTask} />
                </RecommendedTaskProvider>
              </div>
            </div>
          )
        ) : null}
      </div>
    </>
  );
};

export default WatchlistItem;

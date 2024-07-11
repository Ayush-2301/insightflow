"use client";
import { Button } from "@/components/ui/button";
import { LucideEdit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task, Watchlist } from "@/lib/types";
import Link from "next/link";
import { deleteTask, updateTask } from "@/lib/actions/tasks";

const WatchlistItem = ({ data }: { data: Watchlist }) => {
  const router = useRouter();

  function editWatchlist() {
    router.push(`watchlist/${data.id}`);
  }
  async function approveTask({ item }: { item: Task }) {
    const updatedTask = item;
    updatedTask.approved = true;
    const taskID = item.id;
    await updateTask({ newTask: updatedTask, taskID });
  }
  async function rejectTask(id: string) {
    await deleteTask({ id });
  }
  return (
    <div className=" group/watchlistItem flex flex-col space-y-2 justify-center px-6 py-4 border rounded-md hover:shadow-md">
      <div className=" flex justify-between items-center">
        <h1 className=" text-3xl font-semibold">{data.title}</h1>
        <Button
          onClick={editWatchlist}
          variant={"ghost"}
          className="  invisible  group-hover/watchlistItem:visible transition-all"
        >
          <LucideEdit className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex  gap-2">
        {data.keywords.map((item) => (
          <span
            key={item.id}
            className="bg-blue-100 text-blue-700 shadow px-2 py-1 rounded-full  capitalize mb-2 w-fit"
          >
            {item.keyword}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {data.tasks?.map((item) => {
          if (item.approved === false)
            return (
              <div key={item.id} className="group/pending flex items-center">
                <Link
                  href={`/watchlist/${data.id}`}
                  className="text-lg font-medium px-2 py-1 cursor-pointer hover:bg-gray-200 rounded-md"
                >
                  {item.title}
                </Link>
                <div
                  onClick={() => approveTask({ item })}
                  className="p-2 border rounded-md  ml-6 mr-2 invisible group-hover/pending:visible cursor-pointer"
                >
                  <Check className="w-2 h-2" />
                </div>
                <div
                  onClick={() => rejectTask(item.id)}
                  className="p-2 border rounded-md invisible group-hover/pending:visible  cursor-pointer "
                >
                  <X className="w-2 h-2" />
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default WatchlistItem;

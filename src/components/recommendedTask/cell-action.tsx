"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Check, MoreHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../Spinner";
import { RecommendedTask, StaticTasks } from "@/lib/types";

const CellAction = ({
  task,
  approveTask,
  rejectTask,
  approveTaskLoading,
}: {
  task: StaticTasks;
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  approveTaskLoading: boolean;
}) => {
  if (approveTaskLoading) return <Spinner size={"default"} />;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" type="button" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group/approve cursor-pointer">
          <div
            onClick={() => approveTask(task.id)}
            className="flex justify-start items-center gap-1 group-hover/approve:text-teal-600"
          >
            <Check className="w-4 h-4" /> Approve
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="group/reject cursor-pointer">
          <div
            onClick={() => rejectTask(task.id)}
            className="flex justify-start items-center gap-1 group-hover/reject:text-red-500"
          >
            <X className="w-4 h-4" /> Reject
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;

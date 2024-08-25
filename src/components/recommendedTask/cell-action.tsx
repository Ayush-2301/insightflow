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
import { StaticTasks } from "@/lib/types";
import { useContext, useState } from "react";

import { RecommendedTaskContext } from "../provider/RecommendedTaskProvider";
import { updateRecommendedTask } from "@/lib/actions/recommended";
import { useToast } from "../ui/use-toast";

const CellAction = ({ task }: { task: StaticTasks }) => {
  const [approveTaskLoading, setApproveTaskLoading] = useState(false);
  const { toast } = useToast();
  const { setStaticTasks } = useContext(RecommendedTaskContext);

  const approveTask = async (id: string) => {
    setApproveTaskLoading(true);
    const status = true;
    const res = await updateRecommendedTask({ id, status });
    if ("error" in res) {
      toast({
        title: "Error approving task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Task approved successfully",
      });
      updateTasksAfterAction(id);
    }
    setApproveTaskLoading(false);
  };

  const rejectTask = async (id: string) => {
    setApproveTaskLoading(true);
    const status = false;
    const res = await updateRecommendedTask({ id, status });
    if ("error" in res) {
      toast({
        title: "Error rejecting task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({ title: "Task rejected successfully" });
      updateTasksAfterAction(id);
    }
    setApproveTaskLoading(false);
  };

  const updateTasksAfterAction = (id: string) => {
    setStaticTasks((prev) => prev.filter((task) => task.id !== id));
  };

  if (approveTaskLoading) return <Spinner size={"default"} />;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {approveTaskLoading ? (
          <Spinner size={"default"} />
        ) : (
          <Button variant="ghost" type="button" className="w-full p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
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

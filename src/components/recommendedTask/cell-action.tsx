"use client";
import { updateRecommendedTask } from "@/lib/actions/recommended";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { useToast } from "../ui/use-toast";
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
import { Context } from "../provider/ContextProvider";
import { RecommendedTask } from "@/lib/types";

const CellAction = ({ task }: { task: RecommendedTask }) => {
  const { setRecommendedTask } = useContext(Context);
  const router = useRouter();
  const { toast } = useToast();
  const [approveTaskLoading, setApproveTaskLoading] = useState(false);
  const approveTask = async (id: string) => {
    setApproveTaskLoading(true);
    const status = true;
    const res = await updateRecommendedTask({ id, status });
    console.log(res);
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
      router.refresh();
      setRecommendedTask((prev) =>
        prev ? prev.filter((task) => task.task_id !== id) : []
      );
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
      router.refresh();
      setRecommendedTask((prev) =>
        prev ? prev.filter((task) => task.task_id !== id) : []
      );
    }
    setApproveTaskLoading(false);
  };
  if (approveTaskLoading) return <Spinner size={"default"} />;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
            onClick={() => approveTask(task.task_id)}
            className="flex justify-start items-center gap-1 group-hover/approve:text-teal-600"
          >
            <Check className="w-4 h-4" /> Approve
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="group/reject cursor-pointer">
          <div
            onClick={() => rejectTask(task.task_id)}
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

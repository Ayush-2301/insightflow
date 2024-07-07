"use client";
import { useContext, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import TaskForm from "./TaskForm";
import { Context } from "@/components/provider/ContextProvider";
import { Task } from "@/lib/types";
import { getSingleTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Icons } from "@/components/icons/icons";
import { Skeleton } from "@/components/ui/skeleton";

export function EditTask({ userID }: { userID: string }) {
  const { taskID, setTaskID } = useContext(Context);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [initialValue, setInitialValue] = useState<Task | null>(null);

  useEffect(() => {
    if (taskID) {
      setOpen(true);
      setLoading(true);
      const fetchTask = async () => {
        const task = await getSingleTask({ id: taskID });
        setInitialValue(task || null);
        setLoading(false);
      };
      fetchTask();
    } else {
      setInitialValue(null);
    }
  }, [taskID]);

  const handleClose = () => {
    setOpen(!open);
    setTaskID("");
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-1" /> Create Task
        </Button>
      </SheetTrigger>
      <SheetTitle hidden></SheetTitle>
      <SheetDescription hidden></SheetDescription>
      <SheetContent className="min-w-[600px] w-full  ">
        {isLoading ? (
          <TaskFormSkeleton />
        ) : (
          <TaskForm
            initialData={initialValue}
            taskID={taskID}
            userID={userID}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
export function TaskFormSkeleton() {
  return (
    <div className="flex flex-col items-start py-4  space-y-8 ">
      <div className="flex justify-between  w-full item-start">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-[30px] w-[200px] rounded-md" />
          <Skeleton className="h-[30px] w-[300px] rounded-md" />
        </div>
      </div>
      <div className="w-full space-y-4 flex flex-col items-start">
        <Skeleton className="h-[50px] w-[300px] rounded-md" />
        <div className="flex items-start justify-center  space-x-2">
          <Skeleton className="h-[35px] w-[150px] rounded-md" />
        </div>
        <div className="flex items-start justify-center space-x-2">
          <Skeleton className="h-[35px] w-[150px] rounded-md" />
        </div>
        <div className="flex items-start justify-center space-x-2">
          <Skeleton className="h-[35px] w-[150px] rounded-md" />
        </div>
        <div className="flex items-start justify-center space-x-2">
          <Skeleton className="h-[35px] w-[150px] rounded-md" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>
    </div>
  );
}

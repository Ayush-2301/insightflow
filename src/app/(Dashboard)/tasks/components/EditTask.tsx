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
import { Task, Trello } from "@/lib/types";
import { getSingleTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { getTrelloInfo } from "@/lib/actions/trello";

export function EditTask({ userID }: { userID: string }) {
  const { toast } = useToast();
  const { taskID, setTaskID, openSheet, setOpenSheet } = useContext(Context);
  const [isLoading, setLoading] = useState(false);
  const [trelloInfo, setTrelloInfo] = useState<Trello | null | undefined>();
  const [initialValue, setInitialValue] = useState<Task | null>(null);

  useEffect(() => {
    if (taskID) {
      setOpenSheet(true);
      setLoading(true);
      fetchTaskAndTrelloInfo();
    } else {
      setInitialValue(null);
    }
  }, [taskID]);

  const fetchTaskAndTrelloInfo = async () => {
    try {
      const [task, trello_info] = await Promise.all([
        getSingleTask({ id: taskID }),
        getTrelloInfo(),
      ]);

      if ("error" in task) {
        handleFetchError("Error fetching task");
        return;
      }

      if (trello_info && "error" in trello_info) {
        handleFetchError("Error fetching trello info");
      } else {
        setInitialValue(task || null);
        setTrelloInfo(trello_info);
        setLoading(false);
      }
    } catch (error) {
      handleFetchError("An unexpected error occurred");
    }
  };

  const handleFetchError = (message: string) => {
    toast({ title: message, variant: "destructive" });
    setOpenSheet(false);
    setTaskID("");
  };

  const handleClose = () => {
    setOpenSheet(!openSheet);
    setTaskID("");
  };

  return (
    <Sheet open={openSheet} onOpenChange={handleClose}>
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
            trelloInfo={trelloInfo}
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

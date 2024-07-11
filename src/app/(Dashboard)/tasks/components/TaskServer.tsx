import { getAllTasks } from "@/lib/actions/tasks";
import React, { Suspense } from "react";
import Tasks from "./Tasks";
import { Skeleton } from "@/components/ui/skeleton";

const TaskServer = async () => {
  const tasks = await getAllTasks();
  if ("error" in tasks) {
    return (
      <div className="mt-6">
        <div className="py-6 px-8 bg-gray-200 flex rounded-md justify-center items-center">
          Nothing to Show
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<TaskSkeleton />}>
      <div className=" mt-6">
        <Tasks tasks={tasks} />
      </div>
    </Suspense>
  );
};

export default TaskServer;

export function TaskSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 flex  items-start  space-y-2 shadow justify-between"
        >
          <div className="flex flex-col space-y-2 items-start">
            <Skeleton className="h-[30px] w-[250px] rounded-md" />
            <Skeleton className="h-[30px] w-[500px] rounded-md" />
            <Skeleton className="h-[30px] w-[300px] rounded-md" />
          </div>
          <div className="flex flex-col justify-between space-y-8">
            <div className="flex space-x-2 ">
              <Skeleton className="h-[30px] w-[100px] rounded-md" />
              <Skeleton className="h-[30px] w-[60px] rounded-sm" />
            </div>
            <Skeleton className="h-[30px] w-[150px] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

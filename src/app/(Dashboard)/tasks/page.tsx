import TaskEditServer from "./components/TaskEditServer";
import TaskServer from "./components/TaskServer";
import { Spinner } from "@/components/Spinner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import HeadingSkeleton from "@/components/HeadingSkeleton";

const TasksPage = () => {
  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <Suspense fallback={<HeadingSkeleton />}>
          <Heading heading="Task Management" description="Manage your tasks" />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <TaskEditServer />
        </Suspense>
      </div>
      <Suspense fallback={<TaskSkeleton />}>
        <TaskServer />
      </Suspense>
    </div>
  );
};

export default TasksPage;

const Loading = () => {
  return (
    <Button>
      <Spinner size={"default"} />
    </Button>
  );
};

const TaskSkeleton = () => {
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
};

"use client";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <div className="flex flex-col h-full justify-between items-start py-4 space-y-8 w-full">
        <div className="flex items-center justify-between">
          <Skeleton className=" h-[60px] w-[50%] rounded-md" />
        </div>
        <Skeleton className="h-[40px] w-[30%] rounded-md" />
        <div className="flex  justify-start items-center gap-3">
          <Skeleton className="h-[40px] w-[150px] rounded-full" />
          <Skeleton className="h-[40px] w-[150px] rounded-full" />
          <Skeleton className="h-[40px] w-[150px] rounded-full" />
        </div>
      </div>
    </>
  );
};

export default loading;

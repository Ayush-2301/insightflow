import { Suspense } from "react";
import CompanyServer from "./components/CompanyServer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <div className="flex flex-col space-y-4">
          <h1 className=" text-5xl font-bold">InsightFlow</h1>
          <p className=" text-xl text-muted-foreground max-w-[70%]">
            A cutting-edge Workflow Intelligence System designed to empower
            businesses by leveraging advanced data insights and automation
          </p>
        </div>
      </div>
      <Suspense fallback={<CompnaySkeleton />}>
        <CompanyServer />
      </Suspense>
    </div>
  );
}

function CompnaySkeleton() {
  return (
    <div className="mt-6 space-y-2">
      <Skeleton className="h-[40px] w-[250px] rounded-xl" />
      <Skeleton className="h-[20px] w-[200px] rounded-lg" />
    </div>
  );
}

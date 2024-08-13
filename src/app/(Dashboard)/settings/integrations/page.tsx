import { Suspense } from "react";
import IntegerationServer from "../components/IntegrationServer";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  return (
    <Suspense fallback={<IntegrationFormLoading />}>
      <IntegerationServer />
    </Suspense>
  );
};

export default page;

const IntegrationFormLoading = () => {
  return (
    <div className=" p-4 bg-gray-100 rounded-md flex flex-col space-y-2">
      <div className="flex space-x-3 items-center">
        <Skeleton className=" w-36 h-12 rounded-lg bg-gray-300" />
        <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[30px] w-full rounded-md bg-gray-300" />
        <Skeleton className="h-[30px] w-full rounded-md bg-gray-300" />
        <Skeleton className="h-[30px] w-full rounded-md bg-gray-300" />
        <Skeleton className="h-[30px] w-full rounded-md bg-gray-300" />
      </div>
    </div>
  );
};

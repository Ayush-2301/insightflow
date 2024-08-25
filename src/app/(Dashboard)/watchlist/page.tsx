import { Button } from "@/components/ui/button";
import WatchlistServer from "./components/WatchlistServer";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Heading from "@/components/Heading";
import HeadingSkeleton from "@/components/HeadingSkeleton";

const WatchListPage = () => {
  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <Suspense fallback={<HeadingSkeleton />}>
          <Heading heading="Watchlist" description="Manage your watchlists" />
        </Suspense>
        <Link href={"/watchlist/new"}>
          <Button type="submit">+ Add New</Button>
        </Link>
      </div>
      <div className="mt-6">
        <Suspense fallback={<WatchlistsSkeleton />}>
          <WatchlistServer />
        </Suspense>
      </div>
    </div>
  );
};

export default WatchListPage;

export function WatchlistsSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 flex flex-col items-start  space-y-2 shadow"
        >
          <Skeleton className="h-[30px] w-[240px] rounded-md" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-[20px] w-[200px]" />
            <Skeleton className="h-[20px] w-[200px]" />
            <Skeleton className="h-[20px] w-[200px]" />
          </div>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[20px] w-[350px]" />
            <Skeleton className="h-[20px] w-[350px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

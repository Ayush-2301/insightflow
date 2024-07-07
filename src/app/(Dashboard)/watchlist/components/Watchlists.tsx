import WatchlistItem from "./WatchlistItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Watchlist, WatchlistReturned } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const Watchlists = ({
  watchlists,
}: {
  watchlists:
    | WatchlistReturned[]
    | {
        error: string;
      }
    | undefined;
}) => {
  const data = watchlists && "error" in watchlists ? undefined : watchlists;
  console.log(data);
  return (
    <div className=" flex flex-col space-y-4">
      <div className=" flex gap-3">
        <Input placeholder="Search Watchlist" />
        <Button>Search</Button>
      </div>
      <Suspense fallback={<WatchlistsSkeleton />}>
        {!data && (
          <div className=" py-6 px-8 bg-gray-200 flex  rounded-md justify-center items-center">
            Nothing to Show
          </div>
        )}

        {data?.map((item) => {
          const watchlist: Watchlist = {
            id: item.watchlist.id,
            user_id: item.watchlist.user_id,
            title: item.watchlist.title,
            createdAt: item.watchlist.createdAt,
            keywords: item.keywords,
            tasks: item.tasks,
          };
          return <WatchlistItem key={watchlist.id} data={watchlist} />;
        })}
      </Suspense>
    </div>
  );
};
export default Watchlists;

export function WatchlistsSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[...Array(5)].map((_, index) => (
        <>
          <div className="bg-white rounded-lg p-4 flex flex-col items-start  space-y-2 shadow">
            <Skeleton className="h-[40px] w-[240px] rounded-md" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-[40px] w-[200px]" />
              <Skeleton className="h-[40px] w-[200px]" />
              <Skeleton className="h-[40px] w-[200px]" />
            </div>
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-[40px] w-[350px]" />
              <Skeleton className="h-[40px] w-[350px]" />
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

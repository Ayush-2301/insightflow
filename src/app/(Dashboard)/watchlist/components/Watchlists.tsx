import WatchlistItem from "./WatchlistItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Watchlist, WatchlistReturned } from "@/lib/types";

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
  return (
    <div className=" flex flex-col space-y-4">
      <div className=" flex gap-3">
        <Input placeholder="Search Watchlist" />
        <Button>Search</Button>
      </div>

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
        };
        return <WatchlistItem key={watchlist.id} data={watchlist} />;
      })}
    </div>
  );
};
export default Watchlists;

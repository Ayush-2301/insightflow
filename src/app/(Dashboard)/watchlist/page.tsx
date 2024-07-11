import { Button } from "@/components/ui/button";
import WatchlistServer from "./components/WatchlistServer";
import Link from "next/link";

const WatchListPage = async () => {
  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <div className="flex flex-col space-y-2">
          <h1 className=" text-5xl font-bold">InsightFlow Watchlists</h1>
          <p className=" text-xl text-muted-foreground">
            Manage your watchlists
          </p>
        </div>
        <Link href={"/watchlist/new"}>
          <Button type="submit">+ Add New</Button>
        </Link>
      </div>
      <div className=" mt-6">
        <WatchlistServer />
      </div>
    </div>
  );
};

export default WatchListPage;

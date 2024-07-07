import { Button } from "@/components/ui/button";
import Watchlists from "./components/Watchlists";
import { getAllWatchlist } from "@/lib/actions/watchlist";
import { redirect } from "next/navigation";

const WatchListPage = async () => {
  const watchlists = await getAllWatchlist();
  async function addWatchlist() {
    "use server";
    redirect("/watchlist/new");
  }
  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <div className="flex flex-col space-y-2">
          <h1 className=" text-5xl font-bold">InsightFlow Watchlists</h1>
          <p className=" text-xl text-muted-foreground">
            Manage your watchlists
          </p>
        </div>
        <form action={addWatchlist}>
          <Button type="submit">+ Add New</Button>
        </form>
      </div>
      <div className=" mt-6">
        <Watchlists watchlists={watchlists} />
      </div>
    </div>
  );
};

export default WatchListPage;

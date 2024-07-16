import { getAllWatchlist } from "@/lib/actions/watchlist";
import Watchlists from "./Watchlists";

const WatchlistServer = async () => {
  const watchlists = await getAllWatchlist();
  return <Watchlists watchlists={watchlists} />;
};

export default WatchlistServer;

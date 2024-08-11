import { getCompany } from "@/lib/actions/company";
import { getWatchlist } from "@/lib/actions/watchlist";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Keyword, Watchlist } from "@/lib/types";
import WatchlistForm from "../../components/WatchlistForm";
import { getMasterKeywords } from "@/lib/actions";

const watchlistMain = async ({
  params,
}: {
  params: { watchlistID: string };
}) => {
  const id = params.watchlistID;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userID = data.user?.id;
  const initialData: Watchlist | undefined =
    id === "new" ? undefined : await getWatchlist({ id });

  let suggestedKeywords: Keyword[] | undefined;
  const res = await getMasterKeywords();

  if (res) {
    suggestedKeywords = res?.map((item) => {
      return {
        id: item.id,
        keyword: item.keyword,
        volume: "0",
        approve: false,
      };
    });
  }

  return (
    <div>
      {userID && (
        <WatchlistForm
          userID={userID}
          initialData={initialData}
          initialsuggestedKeywords={suggestedKeywords}
        />
      )}
    </div>
  );
};

export default watchlistMain;

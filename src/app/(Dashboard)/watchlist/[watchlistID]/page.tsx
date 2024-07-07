import WatchlistForm from "../components/WatchlistForm";
import { Company, type Watchlist } from "@/lib/types";
import { Keyword } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWatchlist } from "@/lib/actions/watchlist";
import { getCompany } from "@/lib/actions/company";
import { master_keywords } from "@/lib/constant";

export default async function Page({
  params,
}: {
  params: {
    watchlistID: string;
  };
}) {
  const id = params.watchlistID;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userID = data.user?.id;
  const initialData: Watchlist | undefined =
    id === "new" ? undefined : await getWatchlist({ id });

  let suggestedKeywords: Keyword[] | undefined;
  const res = await getCompany();

  const isCompanyType = (data: any): data is Company => {
    return data && (data as Company).master_keywords !== undefined;
  };
  if (isCompanyType(res)) {
    suggestedKeywords = master_keywords.map((item) => {
      return {
        id: item.id,
        keyword: item.keyword,
        volume: "0",
        approve: false,
      };
    });
  }

  return (
    <div className="flex-1 space-y-4 p-5">
      {userID && (
        <WatchlistForm
          userID={userID}
          initialData={initialData}
          suggestedKeywords={suggestedKeywords}
        />
      )}
    </div>
  );
}
